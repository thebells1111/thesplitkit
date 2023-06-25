<script>
	import { v4 as uuidv4 } from 'uuid';
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Share from '$lib/Share/Share.svelte';
	import Filter from '$lib/EventsHeader/Filter.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import EventsHeader from '$lib/EventsHeader/EventsHeader.svelte';
	import Dashboard from './Dashboard.svelte';
	import MainSettings from '$lib/Settings/MainSettings/MainSettings.svelte';
	import EditOptions from '$lib/Creator/EditOptions.svelte';
	import PromoEditor from '$lib/PromoEditor/PromoEditor.svelte';
	import SelectBlock from '$lib/Creator/SelectBlock.svelte';
	import { remoteServer, liveBlocks, defaultBlockGuid, mainSettings, activeGuid } from '$/stores';

	let showShareModal = false;
	let showMainSettingsModal = true;
	let showFilterModal = false;
	let showOptionsModal = false;
	let filterType = 'off';
	let mainUnsaved = false;
	let unsaved = false;
	let showEditor = false;
	let showSelectBlock = false;
	let filteredBlocks = [];
	let activeBlockGuid;

	const guid = $page.params.guid;

	$: if (filterType && $liveBlocks) {
		handleFilter();
	}

	$: console.log('unsaved: ', mainUnsaved);

	function handleFilter() {
		console.log('applying filter');
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

	function saveState(editingBlock) {
		editingBlock?.value?.destinations?.forEach((v) => (v.split = Number(v.split)));
		const index = $liveBlocks.findIndex((v) => v.blockGuid === activeBlockGuid);
		if (index > -1) {
			$liveBlocks[index] = clone(editingBlock);
		}

		const filteredIndex = filteredBlocks.findIndex((v) => v.blockGuid === activeBlockGuid);
		if (filteredIndex > -1) {
			filteredBlocks[index] = clone(editingBlock);
		}

		unsaved = false;
	}

	function addBlock(type) {
		const newBlock = {
			image: '',
			title: 'Title - click to edit',
			line: ['Text - click to edit', 'Text - click to edit'],
			link: { text: 'Link - click to edit', url: '' },
			description: '',
			value: { type: 'lightning', method: 'keysend', destinations: [] },

			type,
			settings: {
				totalPercentage: 0,
				split: $mainSettings.splits
			}
		};

		showEditor = true;
		showSelectBlock = false;

		newBlock.eventGuid = $page.params.guid;
		newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

		newBlock.blockGuid = blockGuid;
		newBlock.settings = {
			split: $mainSettings.splits
		};

		if (!$liveBlocks.length) {
			$defaultBlockGuid = blockGuid;
		}

		if (!$liveBlocks.length) {
			$defaultBlockGuid = blockGuid;
		}

		$liveBlocks = $liveBlocks.concat(newBlock);
		mainUnsaved = true;
	}

	async function addFeed(block, type, channel) {
		let addBlock = true;

		if (!block.value) {
			addBlock = window.confirm(
				"This Item doesn't have a value block. Do you still want to add it?"
			);
		}

		if (addBlock) {
			let newBlock = {};
			newBlock.image = block?.artwork || block?.image || channel?.artwork || channel?.image;
			if (channel) {
				newBlock.title = block?.title;
				newBlock.line = [channel?.title, channel?.author];
			} else {
				newBlock.title = block?.title;
				newBlock.line = [channel?.author];
			}

			newBlock.description = block.description;
			newBlock.value = block?.value || channel?.value;
			newBlock.type = type;
			newBlock.link = { text: '', url: '' };

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
			}

			newBlock.feedGuid = channel.podcastGuid || block.podcastGuid;

			newBlock.itemGuid = block.guid;

			newBlock.eventGuid = $page.params.guid;
			newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
				newBlock.duration = await getMediaDuration(block.enclosureUrl);
			}

			let blockGuid;
			do {
				blockGuid = generateBlockGuid();
			} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

			newBlock.blockGuid = blockGuid;
			newBlock.settings = {
				split: $mainSettings.splits
			};

			if (!$liveBlocks.length) {
				$defaultBlockGuid = blockGuid;
			}

			$liveBlocks = $liveBlocks.concat(newBlock);
			mainUnsaved = true;
		}
	}

	function getMediaDuration(url) {
		return new Promise((resolve, reject) => {
			const audio = new Audio();
			audio.preload = 'metadata'; // Load only metadata, not the entire file
			audio.src = url;

			audio.onloadedmetadata = () => {
				resolve(audio.duration);
				audio.remove();
			};

			audio.onerror = (error) => {
				reject(error);
				audio.remove();
			};
		});
	}
</script>

<EventsHeader
	bind:showShareModal
	bind:showMainSettingsModal
	bind:showFilterModal
	blocks={$liveBlocks}
	bind:mainUnsaved
	bind:showSelectBlock
	{filterType}
/>
<broadcast-blocks>
	<Dashboard
		bind:blocks={filteredBlocks}
		{filterType}
		bind:showShareModal
		bind:showOptionsModal
		bind:unsaved
		bind:showEditor
		bind:activeBlockGuid
	/>
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

{#if showEditor}
	<Modal bind:showModal={showEditor} bind:unsaved>
		<PromoEditor
			baseBlock={clone($liveBlocks?.find((v) => v.blockGuid === activeBlockGuid))}
			{saveState}
			bind:unsaved
		/>
	</Modal>
{/if}

{#if showSelectBlock}
	<Modal bind:showModal={showSelectBlock} bind:unsaved>
		<SelectBlock {addBlock} {addFeed} {activeBlockGuid} />
	</Modal>
{/if}

{#if showOptionsModal}
	<EditOptions
		block={$liveBlocks.find((v) => v.blockGuid === activeBlockGuid) || {}}
		bind:showOptionsModal
		bind:showEditor
		{activeBlockGuid}
	/>
{/if}

<style>
	broadcast-blocks {
		display: block;
		flex: 1;
		height: calc(100% - 8px);
	}
</style>
