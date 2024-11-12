<script>
	import DashboardBlockCard from './DashboardBlockCard.svelte';
	import Person from './Person.svelte';
	import formatTime from '$lib/functions/formatTime.js';
	import ResetIcon from '$lib/icons/Refresh.svelte';
	import TimerIcon from '$lib/icons/Timer.svelte';
	import PlayIcon from '$lib/icons/PlayArrow.svelte';
	import PauseIcon from '$lib/icons/Pause.svelte';
	import NoDefault from './NoDefault/NoDefault.svelte';

	import { socket, liveBlocks, defaultBlockGuid, mainSettings, blocksList } from '$/stores';

	export let blocks = [];
	export let filterType = null;
	export let showOptionsModal = false;
	export let activeBlockGuid = null;
	export let player = null;
	export let broadcastTimeRemaining = null;
	export let timeStamp = 0;
	export let isRunning = false;
	export let broadcastingBlockGuid = null;
	export let socketConnect = () => {};
	export let handleTimer = () => {};
	export let handleResetTimer = () => {};
	export let handleBroadcast = () => {};
	export let updateStartTime = () => {};
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
				.every((v) => v?.enclosureUrl || v?.duration)}
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
				{#each blocks
					.filter((v) => v?.blockGuid !== $defaultBlockGuid)
					.filter((v) => v) as block, index}
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
