<script>
	import DashboardBlockCard from './DashboardBlockCard.svelte';
	import Person from './Person.svelte';
	import formatTime from '$lib/functions/formatTime.js';
	import ResetIcon from '$lib/icons/Refresh.svelte';
	import TimerIcon from '$lib/icons/Timer.svelte';
	import PlayIcon from '$lib/icons/PlayArrow.svelte';
	import PauseIcon from '$lib/icons/Pause.svelte';
	import ExpandAllIcon from '$lib/icons/ExpandAll.svelte';
	import CollapseAllIcon from '$lib/icons/CollapseAll.svelte';
	import SwapVertIcon from '$icons/SwapVert.svelte';
	import NoDefault from './NoDefault/NoDefault.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import BlockSorter from './BlockSorter/BlockSorter.svelte';

	import { socket, liveBlocks, defaultBlockGuid, mainSettings, blocksList } from '$/stores';

	export let blocks = [];
	export let filterType = null;
	export let player = null;
	export let broadcastTimeRemaining = null;
	export let timeStamp = 0;
	export let isRunning = false;
	export let broadcastingBlockGuid = null;
	export let showSelectBlock = false;
	export let socketConnect = () => {};
	export let handleTimer = () => {};
	export let handleResetTimer = () => {};
	export let handleBroadcast = () => {};
	export let updateStartTime = () => {};
	export let downloadMP3 = () => {};
	export let handleDeleteBlock = () => {};
	export let handleCopyBlock = () => {};

	let showBlockSorter = false;
	let expandAll = false;

	// Scroll functions for each button
	function scrollToTop() {
		const blocksContainer = document.querySelector('blocks');
		if (blocksContainer) {
			blocksContainer.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to very top
		}
	}

	function scrollToBottom() {
		const blocksContainer = document.querySelector('blocks');
		if (blocksContainer) {
			blocksContainer.scrollTo({ top: blocksContainer.scrollHeight, behavior: 'smooth' }); // Scroll to very bottom
		}
	}

	function scrollToActive() {
		const activeDiv = document.querySelector('blocks > div.active');
		if (activeDiv) {
			activeDiv.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
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
				.every((v) => v?.enclosureUrl || v?.duration)}
			<warning>Playlist Mode Error - Fix blocks with no enclosure url or duration</warning>
		{/if}
		{#if !$liveBlocks.find((v) => v?.blockGuid === $defaultBlockGuid)?.value?.destinations?.length && $mainSettings.broadcastMode !== 'edit'}
			<warning>Error - Your default block needs a value block</warning>
		{/if}

		{#if ['playlist', 'edit'].find((v) => v === $mainSettings?.broadcastMode)}
			<audio autoplay controls bind:this={player} class:hidden={player?.src} />
		{/if}

		<controls>
			<button-container>
				<button
					class="expand"
					on:click={() => {
						expandAll = !expandAll;
					}}
				>
					{#if expandAll}
						<CollapseAllIcon size="30" />
					{:else}
						<ExpandAllIcon size="30" />
					{/if}
				</button>
				<p>{expandAll ? 'collapse all' : 'expand all'}</p>
			</button-container>
			{#if ['playlist', 'podcast'].find((v) => v === $mainSettings?.broadcastMode)}
				<time-stamp>
					<controls>
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
						{#if isRunning}
							<timer>{formatTime(timeStamp, true)}</timer>
						{:else}
							<timer-input>
								<input bind:value={timeStamp} type="number" />
								<p class="input-secs">secs</p>
							</timer-input>
						{/if}
						<button class="reset-button" on:click={handleResetTimer}>
							<ResetIcon size="32" />
						</button>
					</controls>
					<p>master clock</p>
				</time-stamp>
			{:else}
				<controls-spacer />
			{/if}

			<block-nav>
				<button-container>
					<button class="scroll top" on:click={scrollToTop}> top </button>
					<button class="scroll active" on:click={scrollToActive}> active </button>
					<button class="scroll bottom" on:click={scrollToBottom}> bottom </button>
				</button-container>
				<p>scroll to block</p>
			</block-nav>

			<button-container>
				<button
					class="sort"
					on:click={() => {
						showBlockSorter = !showBlockSorter;
					}}
				>
					<SwapVertIcon size="30" />
				</button>
				<p>sort blocks</p>
			</button-container>
		</controls>

		<top>
			<transparent-spacer />
		</top>

		{#if filterType === 'person'}
			<Person {blocks} bind:broadcastingBlockGuid {handleBroadcast} />
		{:else if blocks?.[0] || blocks?.[1]}
			<blocks bind:this={$blocksList}>
				{#each blocks.filter((v) => v) as block, index}
					<DashboardBlockCard
						bind:block
						bind:broadcastingBlockGuid
						bind:showSelectBlock
						{index}
						{broadcastTimeRemaining}
						{handleBroadcast}
						{updateStartTime}
						{downloadMP3}
						{handleDeleteBlock}
						{handleCopyBlock}
						{expandAll}
					/>
				{/each}
			</blocks>
		{:else}
			<p>Click the blue add button to add your first block.</p>
		{/if}
	{/if}
</div>

{#if showBlockSorter && $liveBlocks?.length > 1}
	<Modal
		bind:showModal={showBlockSorter}
		closeModal={() => {
			$liveBlocks = $liveBlocks;
		}}
	>
		<BlockSorter bind:blocks={$liveBlocks} />
	</Modal>
{/if}

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
		margin-bottom: 16px;
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
		margin: 28px 0 4px 0;
	}

	controls {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-start;
	}

	time-stamp {
		display: flex;
		flex-direction: column;
		margin: 8px 0 0 0;
		justify-content: flex-start;
		align-items: center;
		width: 210px;
	}
	time-stamp > controls {
		align-items: center;
	}

	time-stamp > controls p,
	time-stamp > controls button {
		background-color: white;
		color: red;
		width: 42px;
		height: 42px;
		padding: 0;
		overflow: hidden;
		margin: 0 16px;
	}

	time-stamp .timer-button {
		color: var(--color-text-0);

		position: relative;
	}

	block-nav {
		display: flex;
		flex-direction: column;
		width: 210px;
		justify-content: center;
		align-items: center;
	}

	block-nav > button-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	block-nav > button-container > button:nth-of-type(2) {
		margin: 0;
	}

	button-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		margin: 8px 0 0 0;
	}

	button-container p,
	time-stamp > p,
	block-nav > p {
		font-size: 0.7em;
		margin: 0;
		padding: 4px 0 0 0;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 42px;
		height: 42px;
		margin: 0 16px;
		border-radius: 25px;
		padding: 0;
		background-color: hsl(0, 0%, 100%);
		color: var(--color-text-0);
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
		width: 40px;
		display: flex;
		justify-content: center;
	}

	timer-input {
		width: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	timer-input > p.input-secs {
		font-size: 0.8em;
		color: initial;
		text-align: center;
		padding: 0;
		margin: 0;
		width: initial;
		height: initial;
	}

	input {
		width: 40px;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield; /* Firefox */
	}

	.scroll {
		font-size: 0.6em;
	}

	.scroll.top {
		background-color: var(--color-theme-light-purple);
		color: hsl(277, 100%, 44%);
	}

	.scroll.active {
		background-color: var(--color-theme-light-blue);
		color: rgb(0, 132, 180);
	}

	.scroll.bottom {
		color: var(--color-text-0);
		background-color: var(--color-theme-light-yellow);
	}
</style>
