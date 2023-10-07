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
	export let blocks = [];
	export let filterType;
	export let showOptionsModal = false;
	export let activeBlockGuid;

	let broadcastingBlockGuid;
	let player;
	let broadcastTimeRemaining;
	let broadcastIntervalTimer;
	let broadcastTimeInterval;
	let chapterIndex;
	export let guid = $page.params.guid;

	$: if (player && !['playlist', 'edit'].find((v) => v === $mainSettings?.broadcastMode)) {
		player.src = null;
	}

	$: if (player && ['edit'].find((v) => v === $mainSettings?.broadcastMode)) {
		player.autoplay = false;
		player.src = $mainSettings?.editEnclosure;
	}

	$: onMount(async () => {
		if (!$liveBlocks?.length) {
			loadSocket();
		}
	});

	$: if (guid && $activeBroadcastGuid !== guid) {
		$activeBroadcastGuid = guid;
		loadSocket();
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
			if (guid) {
				// Send a message with the valueGuid
				$socket.emit('connected', guid);
				console.log('socket connect');
			} else {
				console.log('guid is not defined');
			}
		});
	}

	async function handleBroadcast(block) {
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
					chapterIndex = undefined;
					player.onended = () => {
						handleBroadcast(nextBlock);
					};
					player.ontimeupdate = () => {
						if (block?.duration && player?.currentTime) {
							broadcastTimeRemaining = block.duration - player.currentTime;
							if (broadcastTimeRemaining <= 0) {
								player.pause();
								player.src = null;
								handleBroadcast(nextBlock);
							}
						}
						if (block?.chapters && block?.settings?.chaptersEnabled === true) {
							let chapters = block.chapters?.chapters;
							if (!chapterIndex) {
								chapterIndex = 0;
							}
							while (player.currentTime >= chapters?.[chapterIndex + 1]?.startTime) {
								chapterIndex++;
							}

							while (player.currentTime < chapters?.[chapterIndex]?.startTime) {
								chapterIndex--;
							}
						} else {
							chapterIndex = undefined;
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

	function getNextBlock(block) {
		let index = $liveBlocks.findIndex((v) => v?.blockGuid === block?.blockGuid);
		if (index > -1 && index < $liveBlocks.length - 1) {
			return $liveBlocks[index + 1];
		} else {
			return null;
		}
	}

	function addFees(destinations, isDefault) {
		let splitKitObject = {
			name: 'The Split Kit',
			customKey: '696969',
			customValue: 'boPNspwDdt7axih5DfKs',
			address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			type: 'node',
			split: '5',
			fee: true
		};

		let feeDestinations = destinations?.filter((v) => v.fee) || [];

		if (!isDefault) {
			feeDestinations.push(splitKitObject);
		}
		return feeDestinations;
	}

	function updateSplits(destinations, split) {
		return clone(destinations)
			?.filter((v) => !v.fee)
			?.map((v) => {
				v.split = (v.split * split) / 100;
				return v || [];
			});
	}

	function processBlock(block) {
		let defaultBlock =
			block?.blockGuid === $defaultBlockGuid
				? undefined
				: $liveBlocks.find((v) => v?.blockGuid === $defaultBlockGuid);
		let split = defaultBlock ? block.settings.split : 100;

		let newDestinations = [];

		if (['playlist', 'podcast'].find((v) => v === $mainSettings.broadcastMode)) {
			if (defaultBlock) {
				newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations, true));
				let splitDeduct = block?.value?.destinations?.length ? split : 0;

				newDestinations = newDestinations.concat(
					updateSplits(defaultBlock?.value?.destinations, 100 - splitDeduct)
				);
				newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
				newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));
			} else {
				newDestinations = block?.value?.destinations ? block.value.destinations : [];
			}
		} else {
			if (defaultBlock) {
				newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations, true));
				let splitDeduct = block?.value?.destinations?.length ? split : 0;
				newDestinations = newDestinations.concat(
					updateSplits(defaultBlock?.value?.destinations, 100 - splitDeduct, true)
				);
			}
			newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
			newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));
		}

		delete block.settings;

		if (!block?.link?.text || block?.link?.text === 'Link - click to edit') {
			block.link = block.link || {};
			block.link.text = block?.link?.url;
		}

		if (!block?.link?.url) {
			delete block.link;
		}

		if (block?.value?.destinations) {
			block.value.destinations = newDestinations;
		}

		return block;
	}

	let startTime = 0;
	let pauseTime = 0;
	let timeStamp = 0;
	let totalPausedTime = 0;
	let interval;
	let isRunning = false;
	let resetTimer;

	$: if ($mainSettings?.broadcastMode === 'manual' && timeStamp) {
		let confirmation = confirm('Do you want to reset your timer?');
		if (confirmation) {
			timeStamp = 0;
			resetTimer = true;
		}
	}

	function handleTimer() {
		isRunning = !isRunning;

		if (isRunning) {
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
		} else {
			pauseTime = performance.now(); // capture the time when timer is paused
			clearInterval(interval);
		}
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

	$: if (chapterIndex > -1) {
		let block = $liveBlocks.find((v) => {
			return v?.blockGuid === broadcastingBlockGuid;
		});
		let chapters = block?.chapters?.chapters || [];
		let activeChapter = chapters[chapterIndex];
		if (activeChapter) {
			let chapterBlock = clone(block);
			chapterBlock.title = activeChapter.title;
			chapterBlock.line = [];
			chapterBlock.image = activeChapter.img;
			chapterBlock.link = activeChapter.url
				? { text: activeChapter.url, url: activeChapter.url }
				: undefined;
			broadcastBlock(chapterBlock);
		}
	}

	$: console.log($mainSettings);
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
		{#if $mainSettings?.broadcastMode === 'playlist' && !$liveBlocks.every((v) => v.enclosureUrl || v.duration)}
			<warning>Playlist Mode Error - Fix blocks with no enclosure url or duration</warning>
		{/if}
		{#if !$liveBlocks.find((v) => v?.blockGuid === $defaultBlockGuid)?.value?.destinations?.length && $mainSettings.broadcastMode !== 'edit'}
			<warning>Error - Your default block needs a value block</warning>
		{/if}

		{#if ['playlist', 'edit'].find((v) => v === $mainSettings?.broadcastMode)}
			<audio autoplay controls bind:this={player} class:hidden={player?.src} muted />
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
