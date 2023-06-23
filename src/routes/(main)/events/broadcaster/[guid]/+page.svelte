<script>
	import { v4 as uuidv4 } from 'uuid';
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Share from '$lib/Share/Share.svelte';
	import Filter from './Filter.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import MainHeader from './MainHeader.svelte';
	import Broadcast from './Broadcast.svelte';
	import MainSettings from './MainSettings.svelte';
	import { remoteServer, liveBlocks, defaultBlockGuid, mainSettings } from '$/stores';

	let showShareModal = false;
	let showMainSettingsModal = false;
	let showFilterModal = false;
	let filterType = 'off';
	let filteredBlocks = [];

	const guid = $page.params.guid;

	$: if (filterType && $liveBlocks) {
		if (filterType !== 'off') {
			filteredBlocks = $liveBlocks.filter((v) => v.type === filterType);
		} else {
			filteredBlocks = clone($liveBlocks);
		}
	}

	onMount(async () => {
		if (!$liveBlocks.length) {
			loadBlocks();
		}
	});

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();
		console.log(data);

		const blocks = data.blocks || [];
		$mainSettings = data.settings || $mainSettings;

		blocks.forEach((block) => {
			if (block.default) {
				$defaultBlockGuid = block.blockGuid;
			}
			if (!block.link.text) {
				block.link.text = 'Link - click to edit';
			}
			if (!block.title) {
				block.title = 'Title - click to edit';
			}
			for (let i = 0; i < block.line.length; i++) {
				if (!block.line[i]) {
					block.line[i] = 'Text - click to edit';
				}
			}
			if (!block.blockGuid) {
				let blockGuid;
				do {
					blockGuid = generateBlockGuid();
				} while (!isBlockGuidUnique(blockGuid, blocks));

				block.blockGuid = blockGuid;
			}
		});
		if (!$defaultBlockGuid) {
			$defaultBlockGuid = blocks[0].blockGuid;
		}

		$liveBlocks = blocks;
		console.log($liveBlocks);
	}

	function generateBlockGuid() {
		let uniqueId = uuidv4();
		return uniqueId;
	}

	function isBlockGuidUnique(blockGuid, blocks) {
		for (let block of blocks) {
			if (block.blockGuid === blockGuid) {
				return false;
			}
		}
		return true;
	}
</script>

<MainHeader bind:showShareModal bind:showMainSettingsModal bind:showFilterModal {filterType} />
<broadcast-blocks>
	<Broadcast bind:blocks={filteredBlocks} {filterType} />
</broadcast-blocks>

{#if showShareModal}
	<Modal bind:showModal={showShareModal}>
		<Share liveGuid={guid} />
	</Modal>
{/if}

{#if showMainSettingsModal}
	<Modal bind:showModal={showMainSettingsModal}>
		<MainSettings />
	</Modal>
{/if}

{#if showFilterModal}
	<Modal bind:showModal={showFilterModal}>
		<Filter bind:filterType bind:showFilterModal />
	</Modal>
{/if}

<style>
	broadcast-blocks {
		display: block;
		flex: 1;
		height: calc(100% - 8px);
	}
</style>
