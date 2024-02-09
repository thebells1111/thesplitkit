<script>
	import { onMount, tick } from 'svelte';
	import io from 'socket.io-client';
	import clone from 'just-clone';
	import DashboardBlockCard from './DashboardBlockCard.svelte';
	import Person from './Person.svelte';
	import formatTime from '$lib/functions/formatTime.js';
	import ResetIcon from '$lib/icons/Refresh.svelte';
	import TimerIcon from '$lib/icons/Timer.svelte';
	import PlayIcon from '$lib/icons/PlayArrow.svelte';
	import PauseIcon from '$lib/icons/Pause.svelte';
	import NoDefault from './NoDefault/NoDefault.svelte';
	import fetchChapters from '$lib/functions/dashboard/fetchChapters.js';
	import getEpisode from '$lib/functions/dashboard/getEpisode.js';
	import processBlock from '$lib/functions/dashboard/processBlock.js';
	import getNextBlock from '$lib/functions/dashboard/getNextBlock.js';
	import findCurrentChapter from '$lib/functions/dashboard/findCurrentChapter.js';
	import getVTS from '$lib/functions/dashboard/getVTS.js';
	import fetchFeed from '$lib/functions/dashboard/fetchFeed.js';
	import createChapterBroadcast from '$lib/functions/dashboard/createChapterBroadcast.js';
	import createVTSBroadcast from '$lib/functions/dashboard/createVTSBroadcast.js';

	import { page } from '$app/stores';
	import {
		remoteServer,
		socket,
		activeBroadcastGuid,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		blocksList
	} from '$/stores';
	export let guid = $page.params.guid;
	export let blocks = [];
	export let filterType;
	export let showOptionsModal = false;
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
	let interval;
	let isRunning = false;
	let resetTimer;
	let storedGuid = '';
	let broadcastingBlockGuid;
	let fallbackBlock;
	let broadcastingBlock;

	onMount(async () => {
		if (!$liveBlocks?.length) {
			loadSocket();
		}
		loadSocket();
	});

	$: if (player) {
		player.volume = 0; //DELETE THIS WHEN DONE!!!!
		console.log('--------------------------------');
		console.log("Don't forget to delete 0 volume");
		console.log('--------------------------------');
	}

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
			console.log(message);
			console.log(broadcastingBlockGuid);
			let block = $liveBlocks.find((v) => v.blockGuid === message);
			if (!isRunning) {
				startTimer();
			}
			block = block || getNextBlock({ blockGuid: broadcastingBlockGuid });
			broadcastingBlockGuid = block.blockGuid;
			console.log(block);

			handleBroadcast(block);
		});
	}

	async function handleBroadcast(block) {
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

		if (
			($mainSettings?.broadcastMode === 'playlist' ||
				($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch)) &&
			block
		) {
			let nextBlock = getNextBlock(block);
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

						if (chapters && (block?.settings?.chaptersEnabled === true || true)) {
							let currentChapterIndex = chapterIndex;
							chapterIndex = findCurrentChapter(chapters, player.currentTime);
							console.log(chapterIndex);
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

						if (VTS && (block?.settings?.VTSEnabled === true || true)) {
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
							console.log(modifiedBlock);
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
				} else if ($mainSettings?.broadcastMode === 'podcast') {
					broadcastTimeRemaining = 0;

					broadcastBlock(block);
				} else {
					handleBroadcast(nextBlock);
				}
			}
		} else {
			broadcastBlock(block);
		}

		function nextInterval(nextBlock) {
			broadcastTimeRemaining =
				(broadcastIntervalTimer + block.duration * 1000 - new Date().getTime()) / 1000;
			if (broadcastTimeRemaining <= 0) {
				if ($mainSettings?.broadcastMode === 'podcast') {
					handleBroadcast();
				} else {
					handleBroadcast(nextBlock);
				}
			}
		}
	}

	function broadcastBlock(block) {
		let serverData;
		if (block) {
			broadcastingBlock = clone(block);
			serverData = processBlock(clone(block));
			broadcastingBlockGuid = block?.blockGuid;
			if (timeStamp && block?.blockGuid !== $defaultBlockGuid) {
				let foundBlock = $liveBlocks.find((v) => v?.blockGuid === block?.blockGuid);
				foundBlock.startTime = timeStamp;
				$liveBlocks = $liveBlocks;
			} else {
				let foundBlock = $liveBlocks.find((v) => v?.blockGuid === block?.blockGuid);
				foundBlock.startTime = 0;
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

		$socket.emit('valueBlock', { valueGuid: guid, serverData });
	}

	function handleTimer() {
		if (isRunning) {
			pauseTimer();
		} else {
			startTimer();
		}
	}

	function startTimer() {
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
				console.log(data);
				if (data.status === 'true') {
					return data.episode;
				}
			}
		} catch (error) {
			console.log('fetchFeed Error: ', error);
		}
	}
</script>

<div>
	{#if !$defaultBlockGuid && $mainSettings.broadcastMode !== 'edit'}
		<NoDefault />
	{:else}
		{#if !$socket}
			<button class="primary socket-connect" on:click={socketConnect}
				>Connect to Live Value Server</button
			>
		{/if}
		{#if $mainSettings?.broadcastMode === 'playlist' && !$liveBlocks
				.slice(1)
				.every((v) => v.enclosureUrl || v.duration)}
			<warning>Playlist Mode Error - Fix blocks with no enclosure url or duration</warning>
		{/if}
		{#if !$liveBlocks.find((v) => v?.blockGuid === $defaultBlockGuid)?.value?.destinations?.length && $mainSettings.broadcastMode !== 'edit'}
			<warning>Error - Your default block needs a value block</warning>
		{/if}

		{#if ['playlist', 'edit'].find((v) => v === $mainSettings?.broadcastMode)}
			<audio autoplay controls bind:this={player} class:hidden={player?.src} />
		{/if}

		{#if ['playlist', 'podcast'].find((v) => v === $mainSettings?.broadcastMode)}
			<time-stamp>
				<button class="timer-button" on:click={handleTimer}>
					<TimerIcon size="36" />

					{#if isRunning}
						<pause>
							<PauseIcon size="20" />
						</pause>
					{:else}
						<play>
							<PlayIcon size="20" />
						</play>
					{/if}
				</button>
				<timer>{formatTime(timeStamp, true)}</timer>
				<button class="reset-button" on:click={handleResetTimer}>
					<ResetIcon size="32" />
				</button>
			</time-stamp>
		{/if}

		<top>
			<transparent-spacer />
		</top>

		{#if filterType === 'person'}
			<Person {blocks} bind:broadcastingBlockGuid {handleBroadcast} />
		{:else if blocks?.[0] || blocks?.[1]}
			<blocks bind:this={$blocksList}>
				{#each blocks.filter((v) => v?.blockGuid === $defaultBlockGuid) as block, index}
					{#if block}
						<DashboardBlockCard
							{block}
							{index}
							bind:broadcastingBlockGuid
							bind:activeBlockGuid
							bind:showOptionsModal
							{broadcastTimeRemaining}
							{handleBroadcast}
							{updateStartTime}
						/>
					{/if}
				{/each}
				{#each blocks.filter((v) => v?.blockGuid !== $defaultBlockGuid) as block, index}
					<DashboardBlockCard
						{block}
						{index}
						bind:broadcastingBlockGuid
						bind:activeBlockGuid
						bind:showOptionsModal
						{broadcastTimeRemaining}
						{handleBroadcast}
						{updateStartTime}
					/>
				{/each}
			</blocks>
		{:else}
			<p>Click the blue add button to add your first block.</p>
		{/if}
	{/if}
</div>

<style>
	div {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		overflow: auto;
	}

	top {
		position: relative;
		width: 100%;
		display: flex;
	}

	transparent-spacer {
		display: block;
		height: 20px;
		width: calc(100% - 8px);
		background: linear-gradient(to top, transparent, white);
		position: absolute;
		bottom: -20px;
		z-index: 3;
	}

	blocks {
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
		padding-top: 18px;
		margin-bottom: 0px;
		padding-bottom: 16px;
	}

	.socket-connect {
		margin: 0 auto 8px auto;
		width: 250px;
		background-image: linear-gradient(to bottom, hsl(277, 100%, 44%), hsl(277, 100%, 26.7%));
		color: var(--color-text-1);
	}

	warning {
		font-weight: bold;
		color: red;
	}

	audio {
		width: calc(100% - 16px);
		height: 40px;
		min-height: 40px;
	}

	time-stamp {
		display: flex;
		width: calc(100% - 32px);
		margin: 8px 0;
		justify-content: space-between;
		align-items: center;
	}

	time-stamp button {
		background-color: white;
		color: red;
		width: 42px;
		height: 42px;
		padding: 0;
		overflow: hidden;
	}

	time-stamp .timer-button {
		color: var(--color-text-0);

		position: relative;
	}

	pause,
	play {
		position: absolute;
		background-color: white;
		border-radius: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 0px;
		right: 0px;
	}

	timer {
		font-size: 1.1em;
		font-weight: bold;
	}
</style>
