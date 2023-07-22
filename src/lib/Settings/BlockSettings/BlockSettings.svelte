<script>
	import clone from 'just-clone';

	import { liveBlocks, mainSettings, defaultBlockGuid } from '$/stores';

	import Duration from './Duration.svelte';
	import StartTime from './StartTime.svelte';
	import Enclosure from './Enclosure.svelte';
	import Clips from './Clips.svelte';

	let mainUnsaved = false;
	let initialized = false;
	let savedBlock;
	let initializedBlockGuid;

	let showSaved = false;

	export let block = { settings: { split: 95 } };
	$: console.log(block);

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

	$: console.log(block.duration);

	function compareBlock() {
		if (JSON.stringify(block) !== JSON.stringify(savedBlock)) {
			savedBlock = clone(block);
			if (initialized) {
				mainUnsaved = true;
			} else {
				initialized = true;
				initializedBlockGuid = block.blockGuid;
				if (!block.settings) {
					block.settings = { split: 95 };
				}
			}
		}
	}

	function getBlock(blockGuid) {
		let block = $liveBlocks.find((v) => v.blockGuid === blockGuid);
		block = block || {};
		block.settings = block?.settings || {};
		return block;
	}
</script>

<settings-container>
	<label>
		<p>Default value split for this block</p>
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

<Duration bind:block />
<StartTime bind:block />
<Enclosure bind:block bind:mainUnsaved />

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	settings-container {
		width: calc(100% - 16px);
		margin: 8px;
	}
	label {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		width: 100%;
		margin-bottom: 4px;
	}

	p {
		margin: 0;
		padding: 0;
		font-weight: bold;
	}

	percent {
		align-self: flex-end;
	}

	percent input {
		width: 40px;
		padding: 4px 0;
		text-align: right;
		margin-left: 8px;
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
