<script>
	import clone from 'just-clone';

	import { liveBlocks, mainSettings, defaultBlockGuid } from '$/stores';

	import TimeInputs from './TimeInputs.svelte';
	import Enclosure from './Enclosure.svelte';
	import Chapters from './Chapters.svelte';
	import Clips from './Clips.svelte';

	let initialized = false;
	let savedBlock;

	let showSaved = false;

	export let block = { settings: { split: 95 } };

	$: {
		if (block.settings.split < 0) block.settings.split = 0;
		if (block.settings.split > 100) block.settings.split = 100;
	}

	function preventCertainInput(event) {
		// Prevent 'e' and '-' from being inputted
		if (event.key === 'e' || event.key === '-') {
			event.preventDefault();
		}
	}

	$: compareBlock(block);

	function compareBlock() {
		if (JSON.stringify(block) !== JSON.stringify(savedBlock)) {
			savedBlock = clone(block);

			if (!block.settings) {
				block.settings = { split: 95 };
			}
		}
	}
</script>

<div>
	<settings-container>
		<label>
			<h3>Default Block Value Split</h3>
			<percent
				><input
					type="number"
					bind:value={block.settings.split}
					min="0"
					max="100"
					on:keydown={preventCertainInput}
				/>%</percent
			>
		</label>
	</settings-container>

	<TimeInputs bind:block bind:time={block.startTime} title="Start Time" />
	<TimeInputs bind:block bind:time={block.duration} title="Block Playback Duration" />
	<Enclosure bind:block />
	{#if block?.chaptersUrl}
		<Chapters bind:block />
	{/if}
	<!-- {#if ['podcast', 'music'].find((v) => v === block?.type) && block.enclosureUrl}
		<Clips bind:block />
	{/if} -->
</div>

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	div {
		width: calc(100% - 16px);
	}
	settings-container {
		width: calc(100% - 16px);
		margin: 8px;
	}
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 300px;
		margin-bottom: 4px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: var(--color-theme-blue);
	}

	percent {
		align-self: flex-end;
		min-width: 75px;
	}

	percent input {
		width: 40px;
		padding: 4px 0;
		text-align: right;
		margin: 0 8px;
	}

	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 25px;
		padding: 0;
		margin: 16px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		position: relative;
		right: 100px;
	}

	.unsaved {
		animation: heartbeat 1s infinite;
		z-index: 2;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
		50% {
			transform: scale(1.1);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
	}
</style>
