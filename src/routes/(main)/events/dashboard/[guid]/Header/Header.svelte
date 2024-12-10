<script>
	import Settings from '$lib/icons/Settings.svelte';
	import Share from '$lib/icons/Share.svelte';
	import AddBlocks from '$lib/icons/AddBlocks.svelte';
	import { page } from '$app/stores';
	import remoteSave from '$lib/functions/remoteSave.js';
	import Save from '$lib/icons/Save.svelte';

	export let showShareModal;
	export let showMainSettingsModal;
	export let showSelectBlock;

	import clone from 'just-clone';
	import SaveModal from '$lib/Modal/SaveModal.svelte';

	import { liveBlocks, defaultBlockGuid, changeDefault, mainSettings } from '$/stores';

	let initialized = false;
	let savedBlocks = [];
	let showSaved = false;
	let saveTimeout;
	let savingText = '';

	$: compareBlocks($liveBlocks);

	function compareBlocks(blocks) {
		if (JSON.stringify(blocks) !== JSON.stringify(savedBlocks)) {
			savedBlocks = clone(blocks);
			if (initialized) {
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(saveState, 1000);
			} else {
				initialized = true;
			}
		}
	}

	function saveState() {
		remoteSave($liveBlocks, $page.params.guid);
		savingText = `Last Saved: ${formatTime(new Date())}`;
	}

	function formatTime(date) {
		const hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'pm' : 'am';
		const hour12 = hours % 12 || 12; // Convert 0 hour to 12
		return `${hour12}:${minutes}:${seconds} ${ampm}`;
	}
</script>

<header>
	<button class="save" type="submit" on:click={saveState}>
		<Save size="32" />
	</button>
	<button on:click={() => (showShareModal = true)}>
		<Share size="32" />
	</button>
	<button
		class="add-block"
		class:disabled={false}
		on:click={() => {
			showSelectBlock = true;
			if (!$defaultBlockGuid && $mainSettings.broadcastMode !== 'edit') {
				$changeDefault = true;
			}
		}}
	>
		<AddBlocks size="36" />
	</button>

	<button on:click={() => (showMainSettingsModal = true)}>
		<Settings size="32" />
	</button>
	<spacer />
	<p>{savingText}</p>
</header>

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	header {
		width: 100%;
		max-width: 350px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
		height: 64px;
		position: relative;
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
		margin: 0 8px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	.add-block {
		height: 60px;
		width: 60px;
		border-radius: 30px;
		color: var(--color-text-1);
		background-color: rgb(0, 132, 180);
	}

	.disabled {
		background-color: hsl(0, 0%, 92%);
		color: hsl(0, 0%, 77%);
	}

	spacer {
		width: 60px;
	}

	p {
		position: absolute;
		text-align: center;
		font-size: 0.9em;
		bottom: -20px;
		margin: 0;
		padding: 0;
		width: 100%;
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
