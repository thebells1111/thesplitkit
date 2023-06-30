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

	import { page } from '$app/stores';
	import {
		remoteServer,
		socket,
		activeBroadcastGuid,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		timeStamp
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
	export let guid = $page.params.guid;

	$: if (player && !$mainSettings?.broadcastMode === 'playlist') {
		player.src = null;
	}

	$: console.log(player);

	onMount(async () => {
		if (!$liveBlocks?.length) {
			loadSocket();
		}
	});

	$: if ($activeBroadcastGuid !== guid) {
		$activeBroadcastGuid = guid;
		loadSocket;
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
		let serverData;
		broadcastIntervalTimer = null;
		clearInterval(broadcastTimeInterval);
		await tick();

		if ($mainSettings?.broadcastMode === 'playlist' && block) {
			let nextBlock = getNextBlock(block);
			if (block.enclosureUrl) {
				if (player) {
					player.src = block.enclosureUrl;
					player.onended = () => {
						handleBroadcast(nextBlock);
					};
					player.ontimeupdate = () => {
						if (block?.duration && player?.currentTime) {
							broadcastTimeRemaining = block.duration - player.currentTime;
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
		} else {
			broadcastBlock(block);
		}

		function nextInterval(nextBlock) {
			broadcastTimeRemaining =
				(broadcastIntervalTimer + block.duration * 1000 - new Date().getTime()) / 1000;
			if (broadcastTimeRemaining <= 0) {
				handleBroadcast(nextBlock);
			}
		}

		function broadcastBlock(block) {
			if (block) {
				serverData = processBlock(clone(block));
				broadcastingBlockGuid = block.blockGuid;
				if ($timeStamp) {
					let foundBlock = $liveBlocks.find((v) => v.blockGuid === block.blockGuid);
					foundBlock.startTime = $timeStamp;
					$liveBlocks = $liveBlocks;
				}
			} else {
				broadcastingBlockGuid = null;
				broadcastTimeRemaining = null;
				serverData = {};
			}

			$socket.emit('valueBlock', { valueGuid: guid, serverData });
		}
	}

	function getNextBlock(block) {
		let index = $liveBlocks.findIndex((v) => v.blockGuid === block?.blockGuid);
		if (index > -1 && index < $liveBlocks.length - 1) {
			return $liveBlocks[index + 1];
		} else {
			return null;
		}
	}

	function addFees(destinations) {
		return destinations?.filter((v) => v.fee) || [];
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
			block.blockGuid === $defaultBlockGuid
				? undefined
				: $liveBlocks.find((v) => v.blockGuid === $defaultBlockGuid);

		let split = defaultBlock ? block.settings.split : 100;

		let newDestinations = [];

		if (defaultBlock) {
			newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations));
			newDestinations = newDestinations.concat(
				updateSplits(defaultBlock?.value?.destinations, 100 - split)
			);
		}
		newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
		newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));

		delete block.settings;

		if (!block.link.text || block.link.text === 'Link - click to edit') {
			block.link.text = block.link.url;
		}

		if (!block.link.url) {
			delete block.link;
		}

		if (block?.value?.destinations) {
			block.value.destinations = newDestinations;
		}

		return block;
	}

	let startTime = 0;
	let pauseTime = 0;
	let totalPausedTime = 0;
	let interval;
	let isRunning = false;

	function handleTimer() {
		isRunning = !isRunning;

		if (isRunning) {
			startTime = startTime ? startTime : performance.now();
			if (pauseTime) {
				totalPausedTime += performance.now() - pauseTime;
				pauseTime = 0; // reset pauseTime
			}

			interval = setInterval(() => {
				const now = performance.now();
				const deltaTime = now - startTime - totalPausedTime;
				$timeStamp = deltaTime / 1000; // update the elapsed time in seconds
			}, 25);
		} else {
			pauseTime = performance.now(); // capture the time when timer is paused
			clearInterval(interval);
		}
	}

	function handleResetTimer() {
		let confirmation = confirm('Do you want to reset your timer?');
		if (confirmation) {
			$timeStamp = 0;
		}
	}
</script>

<div>
	{#if !$socket}
		<button class="primary socket-connect" on:click={socketConnect}
			>Connect to Live Value Server</button
		>
	{/if}
	{#if $mainSettings?.broadcastMode === 'playlist' && !$liveBlocks.every((v) => v.enclosureUrl || v.duration)}
		<warning>Playlist Mode Error - Fix blocks with no enclosure url or duration</warning>
	{:else if $mainSettings?.broadcastMode === 'podcast' && $liveBlocks.find((v) => v.blockGuid === $defaultBlockGuid).type !== 'podcast'}
		<warning>Podcast Mode Error - Your default block needs to be your podcast</warning>
	{/if}

	{#if $mainSettings?.broadcastMode === 'playlist'}
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
			<timer>{formatTime($timeStamp, true)}</timer>
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
	{:else}
		<blocks>
			{#each blocks as block, index}
				<DashboardBlockCard
					{block}
					{index}
					bind:broadcastingBlockGuid
					bind:activeBlockGuid
					bind:showOptionsModal
					{broadcastTimeRemaining}
					{handleBroadcast}
				/>
			{/each}
		</blocks>
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
