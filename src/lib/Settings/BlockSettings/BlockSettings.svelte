<script>
	import clone from 'just-clone';
	import Save from '$lib/icons/Save.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import getMediaDuration from '$lib/functions/getMediaDuration.js';

	import { remoteServer, liveBlocks, mainSettings } from '$/stores';
	import { page } from '$app/stores';

	import Duration from './Duration.svelte';
	import StartTime from './StartTime.svelte';
	import Enclosure from './Enclosure.svelte';

	let mainUnsaved = false;
	let initialized = false;
	let savedSettings = {};

	let showSaved = false;

	export let block = { settings: { split: 95 } };
	$: console.log(block);

	async function saveBlocks() {
		showSaved = true;
		setTimeout(() => (showSaved = false), 500);
		if (block.enclosureUrl && !block.duration) {
			try {
				block.duration = await getMediaDuration(block.enclosureUrl);
			} catch (error) {
				block.duration = 0;
			}
		}

		let activeIndex = $liveBlocks.findIndex((v) => v.blockGuid === block.blockGuid);
		if (activeIndex > -1) {
			$liveBlocks[activeIndex] = block;
		}

		fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks: $liveBlocks, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
			})
			.catch((error) => console.error(error));
		mainUnsaved = false;
	}

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

	$: if (!block.settings) {
		block.settings = { split: 95 };
	}

	$: compareSettings(block.settings);

	$: if (block.duration) {
		mainUnsaved = true;
	}

	function compareSettings() {
		if (JSON.stringify(block.settings) !== JSON.stringify(savedSettings)) {
			savedSettings = clone(block.settings);
			if (initialized) {
				mainUnsaved = true;
			} else {
				initialized = true;
			}
		}
	}
</script>

<button class="save" class:unsaved={mainUnsaved} on:click={saveBlocks}>
	<Save size="32" />
</button>
<label>
	<p>Default value split for active block:</p>
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

{#if $mainSettings?.broadcastMode === 'playlist'}
	<Duration bind:block />
	<StartTime bind:block />
	<Enclosure bind:block bind:mainUnsaved />
{/if}

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	label {
		display: flex;
		flex-direction: column;
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
		width: 50px;
		padding: 4px;
		text-align: right;
	}

	button,
	a {
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
