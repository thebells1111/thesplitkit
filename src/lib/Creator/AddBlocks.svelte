<script>
	import { v4 as uuidv4 } from 'uuid';
	import PromoEditor from '$lib/PromoEditor/PromoEditor.svelte';
	import EditBlockCard from './EditBlockCard.svelte';
	import AddBlocks from '$lib/icons/AddBlocks.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import clone from 'just-clone';
	import SelectBlock from './SelectBlock.svelte';
	import EditOptions from './EditOptions.svelte';
	import { page } from '$app/stores';
	import { defaultBlockGuid, mainSettings } from '$/stores';

	export let blocks = [];
	let editingBlockIndex;
	let showEditor = false;
	let showSelectBlock = false;
	let unsaved = false;
	let showOptionsModal = false;

	function addBlock(type) {
		editingBlockIndex = blocks.length;
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
		} while (!isBlockGuidUnique(blockGuid, blocks));

		newBlock.blockGuid = blockGuid;
		newBlock.settings = {
			split: $mainSettings.splits
		};

		if (!blocks.length) {
			$defaultBlockGuid = blockGuid;
		}

		if (!blocks.length) {
			$defaultBlockGuid = blockGuid;
		}

		blocks.push(newBlock);
	}

	async function addFeed(block, type, channel) {
		let addBlock = true;

		if (!block.value) {
			addBlock = window.confirm(
				"This Item doesn't have a value block. Do you still want to add it?"
			);
		}

		if (addBlock) {
			editingBlockIndex = blocks.length;

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

			console.log(block);
			console.log(channel);
			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
				newBlock.duration = await getMediaDuration(block.enclosureUrl);
			}

			newBlock.feedGuid = channel.podcastGuid || block.podcastGuid;

			newBlock.itemGuid = block.guid;

			newBlock.eventGuid = $page.params.guid;
			newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

			let blockGuid;
			do {
				blockGuid = generateBlockGuid();
			} while (!isBlockGuidUnique(blockGuid, blocks));

			newBlock.blockGuid = blockGuid;
			newBlock.settings = {
				split: $mainSettings.splits
			};

			if (!blocks.length) {
				$defaultBlockGuid = blockGuid;
			}

			blocks.push(newBlock);
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
		blocks[editingBlockIndex] = clone(editingBlock);
		unsaved = false;
	}

	$: if (!showEditor) {
		if (blocks?.[editingBlockIndex]?.title === 'Title - click to edit') {
			blocks.splice(editingBlockIndex, 1);
		}
	}
</script>

<div>
	<top>
		<transparent-spacer />
	</top>
	<blocks>
		{#each blocks as block, index}
			<EditBlockCard {block} {index} bind:editingBlockIndex bind:showOptionsModal />
		{/each}
	</blocks>
</div>
<button class="add-block" on:click={() => (showSelectBlock = true)}>
	<AddBlocks size="40" />
</button>
{#if showEditor}
	<Modal bind:showModal={showEditor} bind:unsaved>
		<PromoEditor baseBlock={clone(blocks[editingBlockIndex])} {saveState} bind:unsaved />
	</Modal>
{/if}

{#if showSelectBlock}
	<Modal bind:showModal={showSelectBlock} bind:unsaved>
		<SelectBlock {addBlock} {addFeed} />
	</Modal>
{/if}

{#if showOptionsModal}
	<EditOptions
		block={blocks[editingBlockIndex]}
		bind:blocks
		{editingBlockIndex}
		bind:showOptionsModal
		bind:showEditor
	/>
{/if}

<style>
	div {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	top {
		position: relative;
		width: 100%;
		display: flex;
	}

	button {
		margin: 0 auto 4px auto;
	}

	transparent-spacer {
		display: block;
		height: 20px;
		width: 100%;
		background: linear-gradient(to top, transparent, white);
		position: absolute;
		bottom: -20px;
	}
	blocks {
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
		padding-top: 18px;
		margin-bottom: 16px;
	}

	button {
		width: 50px;
		height: 50px;
		border-radius: 30px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);

		display: flex;
		align-items: center;
		justify-content: center;

		background-color: white;
		color: var(--color-text-0);
		padding: 0;
	}

	button.add-block {
		width: 60px;
		height: 60px;
		border-radius: 30px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 8px;
		right: 8px;
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 0;
	}

	@media (min-width: 799px) {
		button.add-block {
			right: calc(50% - 392px);
		}
	}
</style>
