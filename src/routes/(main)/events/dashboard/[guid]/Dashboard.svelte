<script>
	import { onMount, tick } from 'svelte';
	import io from 'socket.io-client';
	import clone from 'just-clone';
	import { saveAs } from 'file-saver';
	import { ID3Writer } from 'browser-id3-writer';

	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import fetchChapters from '$lib/functions/dashboard/fetchChapters.js';
	import getEpisode from '$lib/functions/dashboard/getEpisode.js';
	import processBlock from '$lib/functions/dashboard/processBlock.js';
	import getNextBlock from '$lib/functions/dashboard/getNextBlock.js';
	import findCurrentChapter from '$lib/functions/dashboard/findCurrentChapter.js';
	import getVTS from '$lib/functions/dashboard/getVTS.js';
	import fetchFeed from '$lib/functions/dashboard/fetchFeed.js';
	import createChapterBroadcast from '$lib/functions/dashboard/createChapterBroadcast.js';
	import createVTSBroadcast from '$lib/functions/dashboard/createVTSBroadcast.js';
	import buildBlock from '$lib/functions/dashboard/buildBlock.js';

	import Dashboard from './View/Desktop/Dashboard.svelte';

	import { page } from '$app/stores';
	import {
		remoteServer,
		socket,
		activeBroadcastGuid,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		copiedBlock
	} from '$/stores';
	export let guid = $page.params.guid;
	export let blocks = [];
	export let filterType;
	export let activeBlockGuid;

	let player;
	let broadcastTimeRemaining;
	let broadcastIntervalTimer;
	let broadcastTimeInterval;
	let feed;
	let episode;
	let chapters;
	let chapterIndex;
	let VTS;
	let VTSIndex;
	let startTime = 0;
	let pauseTime = 0;
	let timeStamp = 0;
	let totalPausedTime = 0;
	let eventTimestamp = 0;
	let nextBroadcastTime = Infinity;
	let interval;
	let isRunning = false;
	let resetTimer;
	let storedGuid = '';
	let broadcastingBlockGuid;
	let fallbackBlock;
	let broadcastingBlock;
	let showCopied;

	onMount(async () => {
		if (!$liveBlocks?.length) {
			loadSocket();
		}
		loadSocket();
	});

	// $: if (player) {
	// 	player.volume = 0; //DELETE THIS WHEN DONE!!!!
	// 	console.log('--------------------------------');
	// 	console.log("Don't forget to delete 0 volume");
	// 	console.log('--------------------------------');
	// }

	$: if (player && !['playlist', 'edit'].find((v) => v === $mainSettings?.broadcastMode)) {
		player.src = null;
	}

	$: if (player && ['edit'].find((v) => v === $mainSettings?.broadcastMode)) {
		player.autoplay = false;
		player.src = $mainSettings?.editEnclosure;
	}

	$: if (guid && $activeBroadcastGuid !== guid) {
		$activeBroadcastGuid = guid;
		loadSocket();
	}

	$: if (!$mainSettings?.timeRemainingEnabled) {
		if (broadcastingBlock) {
			let serverData = processBlock(clone(broadcastingBlock));

			setTimeout(handleEmit, ($mainSettings.broadcastDelay || 0) * 1000);

			function handleEmit() {
				$socket.emit('valueBlock', { valueGuid: guid, serverData });
			}
		}
	}

	$: if ($mainSettings?.broadcastMode === 'manual' && interval) {
		let confirmation = confirm('Do you want to reset your timer?');
		if (confirmation) {
			clearInterval(interval);
			interval = undefined;
			isRunning = false;
			timeStamp = 0;
			resetTimer = true;
		}
	}

	function loadSocket() {
		$socket = null;
		tick();
		socketConnect();
		console.log('socket connect');
	}

	function socketConnect() {
		$socket = io(remoteServer + '/event?event_id=' + guid, { withCredentials: true });

		$socket.on('connect', () => {
			storedGuid = $socket.id;
			console.log(storedGuid);
			if (guid) {
				// Send a message with the valueGuid
				$socket.emit('connected', guid);
				console.log('socket connect');
			} else {
				console.log('guid is not defined');
			}
		});

		$socket.on('nextBlock', (message) => {
			let block = $liveBlocks.find((v) => v?.blockGuid === message);
			if (!isRunning) {
				startTimer();
			}
			block = block || getNextBlock($liveBlocks, { blockGuid: broadcastingBlockGuid });
			broadcastingBlockGuid = block.blockGuid;

			handleBroadcast(block);
		});

		$socket.on('buildBlock', async (message) => {
			console.log(message);
			if (!message) return;

			if (!isRunning) {
				startTimer();
			}

			let block = await buildBlock(message, $page.params.guid);

			if (block) {
				broadcastingBlockGuid = block.blockGuid;
				handleBroadcast(block);
			}
		});
	}

	async function handleBroadcast(block) {
		if (!block) return;
		nextBroadcastTime = Infinity;
		fallbackBlock = clone(block);
		broadcastingBlock = clone(block);
		fetchEpisode(block.feedGuid, block.itemGuid).then((_episode) => {
			episode = _episode;
			feed = fetchFeed(episode?.feedUrl).then((_feed) => {
				feed = _feed;
				if (feed) {
					episode.rss = getEpisode(feed, block.itemGuid);
					VTS = getVTS(episode.rss);
				}
			});
			fetchChapters(episode).then((_chapters) => {
				chapters = _chapters;
			});
		});
		broadcastIntervalTimer = null;
		clearInterval(broadcastTimeInterval);
		await tick();

		if ($mainSettings?.broadcastMode === 'playlist') {
			let nextBlock = getNextBlock(
				$liveBlocks,
				block,
				$mainSettings?.broadcastMode === 'playlist' && $mainSettings?.playlist?.loopEnabled
			);
			console.log(nextBlock);
			if ($mainSettings?.broadcastMode === 'playlist' && block.enclosureUrl) {
				if (player) {
					player.autoplay = true;
					player.onpause = () => {
						console.log('pause');
						$socket.emit('playerPause', { valueGuid: guid });
					};
					player.onplay = () => {
						console.log('play');
						$socket.emit('playerPlay', { valueGuid: guid });
					};
					player.src = block.enclosureUrl;

					player.onended = () => {
						handleBroadcast(nextBlock);
					};
					player.ontimeupdate = async () => {
						if (block?.duration && player?.currentTime) {
							broadcastTimeRemaining = block.duration - player.currentTime;
							if (broadcastTimeRemaining <= 0) {
								player.pause();
								player.src = null;
								handleBroadcast(nextBlock);
							}
						}

						let modifiedBlock;

						if (chapters && $mainSettings?.chaptersEnabled === true) {
							let currentChapterIndex = chapterIndex;
							chapterIndex = findCurrentChapter(chapters, player.currentTime);
							if (chapterIndex > -1) {
								if (currentChapterIndex !== chapterIndex) {
									modifiedBlock = await createChapterBroadcast(
										chapters,
										chapterIndex,
										modifiedBlock || broadcastingBlock
									);
								}
							} else {
								modifiedBlock = clone(fallbackBlock);
							}
						} else {
							chapterIndex = undefined;
						}

						if (VTS && $mainSettings?.VTSEnabled === true) {
							let currentVTSIndex = VTSIndex;
							if (VTSIndex === undefined) {
								VTSIndex = -1;
							}
							while (player.currentTime >= VTS?.[VTSIndex + 1]?.startTime) {
								VTSIndex++;
							}

							while (player.currentTime < VTS?.[VTSIndex]?.startTime) {
								VTSIndex--;
							}
							if (VTSIndex > -1) {
								if (currentVTSIndex !== VTSIndex) {
									modifiedBlock = await createVTSBroadcast(
										VTS[VTSIndex],
										modifiedBlock || broadcastingBlock,
										fallbackBlock,
										episode
									);
								}
							} else {
								if (currentVTSIndex !== VTSIndex) {
									modifiedBlock = modifiedBlock || clone(fallbackBlock);
								}
							}
						} else {
							VTSIndex = undefined;
						}

						if (modifiedBlock) {
							broadcastBlock(modifiedBlock);
						}
					};
				}
				broadcastBlock(block);
			} else {
				if (player) {
					player.src = null;
				}
				if (block.duration) {
					broadcastIntervalTimer = new Date().getTime();
					broadcastTimeInterval = setInterval(nextInterval.bind(this, nextBlock), 250);
					broadcastBlock(block);
				} else {
					handleBroadcast(nextBlock);
				}
			}
		} else if ($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch) {
			if (block.duration) {
				broadcastIntervalTimer = new Date().getTime();
				broadcastTimeInterval = setInterval(nextInterval.bind(this, block), 250);
				broadcastBlock(block);
			} else {
				broadcastBlock(block);
			}
		} else {
			broadcastBlock(block);
		}

		function nextInterval(nextBlock) {
			broadcastTimeRemaining =
				(broadcastIntervalTimer + block.duration * 1000 - new Date().getTime()) / 1000;

			if (broadcastTimeRemaining < nextBroadcastTime) {
				nextBroadcastTime = broadcastTimeRemaining - 5;

				broadcastTimer();
			}
			if (broadcastTimeRemaining <= 0) {
				nextBroadcastTime = Infinity;
				if ($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch) {
					broadcastIntervalTimer = null;
					clearInterval(broadcastTimeInterval);
					handleBroadcast($liveBlocks[0]);
				} else {
					handleBroadcast(nextBlock);
				}
			}
		}
	}

	function broadcastTimer() {
		let serverData = processBlock(clone(broadcastingBlock));
		if ($mainSettings?.timeRemainingEnabled && nextBroadcastTime < Infinity) {
			serverData.timeRemaining = broadcastTimeRemaining;
		}

		setTimeout(handleEmit, ($mainSettings.broadcastDelay || 0) * 1000);

		function handleEmit() {
			$socket.emit('valueBlock', { valueGuid: guid, serverData });
		}
	}

	function broadcastBlock(block) {
		let serverData;

		if (block) {
			let ts = timeStamp || 0;
			broadcastingBlock = clone(block);
			serverData = processBlock(clone(block));
			serverData.broadcastTimestamp = new Date().getTime();
			serverData.startTime = ts;
			serverData.eventTimestamp = eventTimestamp;
			broadcastingBlockGuid = block?.blockGuid;
			if (timeStamp && block?.blockGuid !== $defaultBlockGuid) {
				let foundBlock = $liveBlocks.find((v) => v?.blockGuid === block?.blockGuid);
				foundBlock.startTime = ts;
				foundBlock.eventTimestamp = eventTimestamp;
				$liveBlocks = $liveBlocks;
			} else {
				let foundBlock = $liveBlocks.find((v) => v?.blockGuid === block?.blockGuid);
				foundBlock.startTime = 0;
				foundBlock.eventTimestamp = eventTimestamp;
				$liveBlocks = $liveBlocks;
			}
		} else {
			if ($mainSettings?.broadcastMode === 'podcast') {
				broadcastingBlockGuid = $defaultBlockGuid;
			} else {
				broadcastingBlockGuid = null;
			}
			broadcastTimeRemaining = null;
			serverData = {};
		}

		console.log(serverData);

		setTimeout(handleEmit, ($mainSettings.broadcastDelay || 0) * 1000);

		function handleEmit() {
			console.log(serverData);
			$socket.emit('valueBlock', { valueGuid: guid, serverData });
		}
	}

	function handleTimer() {
		if (isRunning) {
			pauseTimer();
		} else {
			startTimer();
		}
	}

	function startTimer() {
		if (!timeStamp) {
			eventTimestamp = new Date().getTime();
		}
		isRunning = true;

		startTime = startTime && startTime > 0 ? startTime : performance.now();
		if (pauseTime) {
			totalPausedTime += performance.now() - pauseTime;
			pauseTime = 0; // reset pauseTime
		}

		interval = setInterval(() => {
			const now = performance.now();
			if (resetTimer) {
				startTime = now;
				pauseTime = 0;
				totalPausedTime = 0;
				resetTimer = false;
			}
			const deltaTime = now - startTime - totalPausedTime;
			timeStamp = deltaTime / 1000; // update the elapsed time in seconds
		}, 25);
	}

	function pauseTimer() {
		isRunning = false;
		pauseTime = performance.now(); // capture the time when timer is paused
		clearInterval(interval);
	}

	function handleResetTimer() {
		let confirmation = confirm('Do you want to reset your timer?');
		if (confirmation) {
			timeStamp = 0;
			resetTimer = true;
		}
	}

	function updateStartTime(block) {
		let foundBlock = $liveBlocks.find((v) => v?.blockGuid === block?.blockGuid);
		foundBlock.startTime = player.currentTime;
		$liveBlocks = $liveBlocks;
	}

	async function fetchEpisode(feedGuid, itemGuid) {
		try {
			if (guid) {
				let url =
					remoteServer +
					`/api/queryindex?q=${encodeURIComponent(
						`/episodes/byguid?guid=${itemGuid}&podcastguid=${feedGuid}`
					)}`;

				const res = await fetch(url);
				let data = await res.json();
				if (data.status === 'true') {
					return data.episode;
				}
			}
		} catch (error) {
			console.log('fetchFeed Error: ', error);
		}
	}

	async function setMP3Metadata(blob, metadata) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsArrayBuffer(blob);
			reader.onloadend = () => {
				const buffer = reader.result;
				const writer = new ID3Writer(buffer);
				writer
					.setFrame('TIT2', metadata.title)
					.setFrame('TPE1', [metadata.artist])
					.setFrame('TALB', metadata.album)
					.setFrame('COMM', metadata.comment)
					.setFrame('TXXX', metadata.internalId);
				writer.addTag();
				const taggedArrayBuffer = writer.arrayBuffer;
				const taggedBlob = new Blob([taggedArrayBuffer], {
					type: 'audio/mpeg'
				});
				resolve(taggedBlob);
			};
		});
	}

	async function downloadMP3(block) {
		const res = await fetch(
			remoteServer + '/api/proxy?url=' + encodeURIComponent(block.enclosureUrl),
			{
				headers: { 'User-Agent': 'TheSplitKit/0.1' }
			}
		);
		let blob = await res.blob();

		const metadata = {
			title: block.title,
			artist: block?.line?.[1] || '',
			album: block?.line?.[0] || '',
			comment: {
				description: 'SplitKitMeta',
				text: `SplitKitMeta: {eventGuid:${block.eventGuid}, blockGuid:${block.blockGuid}}`
			},
			internalId: {
				description: 'mAirList',
				value: `<PlaylistItem Class="File"><Title>${block.title}</Title><Artist>${
					block?.line?.[1] || ''
				}</Artist><Comment>{eventGuid:${block.eventGuid}, blockGuid:${
					block.blockGuid
				}}</Comment><ExternalID>{eventGuid:${block.eventGuid}, blockGuid:${
					block.blockGuid
				}, feedGuid:${block.feedGuid}, itemGuid:${block.itemGuid}}</ExternalID></PlaylistItem>`
			}
		};

		blob = await setMP3Metadata(blob, metadata);

		saveAs(
			blob,
			`${sanitizeFilename(block.title)} - ${sanitizeFilename(block?.line?.[1])} - ${
				block.blockGuid
			}.mp3`
		);

		function sanitizeFilename(filename) {
			return filename.replace(/[\\/:*?"<>|\x00-\x1F\x80-\x9F]/g, '');
		}
	}

	function handleDeleteBlock(block) {
		let confirmation = confirm(
			'Are you sure you want to delete ' + (block?.line?.[0] || 'this block?')
		);
		if (confirmation) {
			$liveBlocks = $liveBlocks.filter((v) => v?.blockGuid !== block?.blockGuid);
			if (block?.blockGuid === $defaultBlockGuid) {
				$defaultBlockGuid = null;
				$liveBlocks.unshift(null);
			}
		}
	}

	function handleCopyBlock(block) {
		showCopied = true;
		$copiedBlock = clone(block);
		setTimeout(() => (showCopied = false), 333);
	}
</script>

<Dashboard
	bind:blocks={$liveBlocks}
	bind:filterType
	bind:activeBlockGuid
	bind:player
	bind:broadcastTimeRemaining
	bind:timeStamp
	bind:isRunning
	bind:broadcastingBlockGuid
	{socketConnect}
	{handleTimer}
	{handleResetTimer}
	{handleBroadcast}
	{updateStartTime}
	{downloadMP3}
	{handleDeleteBlock}
	{handleCopyBlock}
/>

{#if showCopied}
	<SaveModal>
		<h2>Copied</h2>
	</SaveModal>
{/if}

<style>
</style>
