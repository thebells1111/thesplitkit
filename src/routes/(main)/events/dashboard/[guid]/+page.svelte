<script>
	import { v4 as uuidv4 } from 'uuid';
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import getMediaDuration from '$lib/functions/getMediaDuration.js';
	import Share from '$lib/Share/Share.svelte';
	import Filter from './Header/Filter.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import EventsHeader from './Header/Header.svelte';
	import Dashboard from './Dashboard.svelte';
	import MainSettings from '$lib/Settings/MainSettings/MainSettings.svelte';
	import OffsetStartTimes from '$lib/Settings/MainSettings/OffsetStartTimes.svelte';

	import EditOptions from '$lib/Creator/EditOptions.svelte';
	import PromoEditor from '$lib/PromoEditor/PromoEditor.svelte';
	import SelectBlock from '$lib/Creator/SelectBlock.svelte';
	import {
		remoteServer,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		activePageGuid,
		changeDefault
	} from '$/stores';

	let showShareModal = false;
	let showMainSettingsModal = false;
	let showFilterModal = false;
	let showOptionsModal = false;
	let filterType = 'off';
	let unsaved = false;
	let showEditor = false;
	let showSelectBlock = false;
	let filteredBlocks = [];
	let activeBlockGuid;
	let showAdded = false;
	let showSaved = false;
	let addDefaultType;
	let saveMainSettings;
	let showOffsetStartTimes = false;
	let verifiedOwner = true;

	const guid = $page.params.guid;

	$: if (filterType && $liveBlocks) {
		handleFilter();
	}

	$: if ($changeDefault) {
		showSelectBlock = true;
	}

	function handleFilter() {
		if (filterType !== 'off') {
			filteredBlocks = $liveBlocks.filter((v) => v.type === filterType);
		} else {
			filteredBlocks = clone($liveBlocks);
		}
	}

	onMount(async () => {
		// verifiedOwner = await verifyOwner();
		console.log(verifiedOwner);
		if (!$liveBlocks.length || $activePageGuid !== guid) {
			$defaultBlockGuid = null;
			await loadBlocks();
			$activePageGuid = guid;
		}
		console.log($liveBlocks);
	});

	async function verifyOwner() {
		const res = await fetch(remoteServer + '/api/sk/verifyowner', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ guid })
		});
		return res.status === 200;
	}

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();
		console.log(data);

		const blocks = data.blocks || [null];
		$mainSettings = Object.keys(data.settings).length ? data.settings : $mainSettings;

		blocks.forEach((block) => {
			if (block) {
				if (block?.settings?.default) {
					$defaultBlockGuid = block?.blockGuid;
					$activePageGuid = guid;
				}
				if (!block?.link?.text) {
					block.link = { text: 'Link - click to edit' };
				}
				if (!block?.title) {
					block.title = 'Title - click to edit';
				}
				for (let i = 0; i < block?.line?.length; i++) {
					if (!block.line[i]) {
						block.line[i] = 'Text - click to edit';
					}
				}
				if (!block?.blockGuid) {
					let blockGuid;
					do {
						blockGuid = generateBlockGuid();
					} while (!isBlockGuidUnique(blockGuid, blocks));

					block.blockGuid = blockGuid;
				}
			}
		});
		if (!$defaultBlockGuid) {
			$defaultBlockGuid = blocks?.[0]?.blockGuid || undefined;
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
			if (block?.blockGuid === blockGuid) {
				return false;
			}
		}
		return true;
	}

	function saveState(editingBlock) {
		console.log('saved');
		showSaved = true;
		setTimeout(() => (showSaved = false), 500);
		editingBlock?.value?.destinations?.forEach((v) => (v.split = v.split.toString()));
		const index = $liveBlocks.findIndex((v) => v?.blockGuid === activeBlockGuid);
		if (index > -1) {
			$liveBlocks[index] = clone(editingBlock);
		}

		const filteredIndex = filteredBlocks.findIndex((v) => v?.blockGuid === activeBlockGuid);
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

		newBlock.eventGuid = $page.params.guid;
		newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

		newBlock.blockGuid = blockGuid;
		newBlock.settings = {
			split: $mainSettings.splits || 95
		};

		activeBlockGuid = blockGuid;

		if ($changeDefault) {
			$defaultBlockGuid = blockGuid;
			newBlock.settings.default = true;
			$liveBlocks[0] = newBlock;
			$changeDefault = false;
		} else {
			$liveBlocks = $liveBlocks.concat(newBlock);
		}

		setTimeout(() => {
			showSelectBlock = false;
			showEditor = true;
		}, 0);
	}

	async function addFeed(block, type, channel) {
		let addBlock = true;

		block.value = block?.value || channel?.value;

		if (!block.value) {
			addBlock = window.confirm(
				"This Item doesn't have a value block. Do you still want to add it?"
			);
		}

		if (addBlock) {
			showAdded = true;
			setTimeout(() => (showAdded = false), 500);
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
			newBlock.value = block?.value ||
				channel?.value || {
					model: {
						type: 'lightning',
						method: 'keysend'
					},
					destinations: []
				};
			newBlock.type = type;

			newBlock.link = {
				text: 'Checkout the Album',
				url: block?.link || channel?.link || `https://podcastindex.org/podcast/${channel.id}`
			};
			newBlock.chaptersUrl = block?.chaptersUrl;

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
			}

			newBlock.feedGuid = channel?.podcastGuid || block?.podcastGuid;
			console.log(channel);
			console.log(block);
			newBlock.feedUrl = channel?.url || block?.url;
			newBlock.medium = channel?.medium || block?.medium;

			newBlock.itemGuid = block.guid;

			newBlock.eventGuid = $page.params.guid;
			newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
				if (!$mainSettings?.lowBandwidth?.audio) {
					newBlock.duration = await getMediaDuration(block.enclosureUrl);
				}
			}

			let blockGuid;
			do {
				blockGuid = generateBlockGuid();
			} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

			newBlock.blockGuid = blockGuid;
			activeBlockGuid = blockGuid;
			newBlock.settings = {
				split: $mainSettings.splits
			};

			if ($changeDefault) {
				$defaultBlockGuid = blockGuid;
				newBlock.settings.default = true;
				$liveBlocks[0] = newBlock;
				$changeDefault = false;
			} else if ($mainSettings.broadcastMode === 'edit' && !$liveBlocks.length) {
				$liveBlocks = [undefined, newBlock];
			} else {
				$liveBlocks = $liveBlocks.concat(newBlock);
			}
			console.log($liveBlocks);
		}
	}
</script>

{#if verifiedOwner === false}
	<div class="unverified">
		<p>You're not verified to edit this event.</p>
		<p><a href="/events">Click here to return to your events.</a></p>
	</div>
{:else if verifiedOwner === true}
	<EventsHeader
		bind:showShareModal
		bind:showMainSettingsModal
		bind:showFilterModal
		blocks={$liveBlocks}
		bind:showSelectBlock
		{filterType}
	/>
	{#if $activePageGuid === guid}
		<broadcast-blocks>
			<Dashboard bind:blocks={filteredBlocks} {filterType} bind:addDefaultType />
		</broadcast-blocks>
	{/if}
{/if}

{#if showShareModal}
	<Modal bind:showModal={showShareModal}>
		<Share liveGuid={guid} shareEvent="true" />
	</Modal>
{/if}

{#if showMainSettingsModal}
	<Modal bind:showModal={showMainSettingsModal} closeModal={saveMainSettings}>
		<MainSettings bind:saveMainSettings bind:showOffsetStartTimes />
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
			baseBlock={clone($liveBlocks?.find((v) => v?.blockGuid === activeBlockGuid))}
			{saveState}
			bind:unsaved
		/>
	</Modal>
{/if}

{#if showSelectBlock}
	<Modal bind:showModal={showSelectBlock} bind:unsaved closeModal={() => ($changeDefault = false)}>
		<SelectBlock {addBlock} {addFeed} bind:showSelectBlock />
	</Modal>
{/if}

{#if showOptionsModal}
	<EditOptions
		block={$liveBlocks.find((v) => v?.blockGuid === activeBlockGuid) || {}}
		bind:showOptionsModal
		bind:showEditor
		{activeBlockGuid}
	/>
{/if}

{#if showOffsetStartTimes}
	<Modal bind:showModal={showOffsetStartTimes}>
		<OffsetStartTimes />
	</Modal>
{/if}

{#if showAdded}
	<SaveModal>
		<h2>Added</h2>
	</SaveModal>
{/if}

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	broadcast-blocks {
		display: block;
		flex: 1;
		height: calc(100% - 60px);
	}

	.unverified {
		text-align: center;
		margin-top: 100px;
	}
</style>
