<script>
	import SelectBlock from './SelectBlock.svelte';
	import Share from '$lib/Share/Share.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import Close from '$lib/icons/Close.svelte';
	import Edit from '$lib/icons/Edit.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import ShareIcon from '$lib/icons/Share.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import clone from 'just-clone';

	import { defaultBlockGuid, liveBlocks, copiedBlock, changeDefault } from '$/stores';

	export let showOptionsModal = false;
	export let block;
	export let showEditor;
	let showCopied = false;

	let showShareModal = false;
	let showSelectBlock = false;

	function closeOptionsModal() {
		showOptionsModal = false;
	}

	function handleDelete() {
		let confirmation = confirm(
			'Are you sure you want to delete ' + (block?.line?.[0] || 'this block?')
		);
		if (confirmation) {
			$liveBlocks = $liveBlocks.filter((v) => v.blockGuid !== block.blockGuid);
			if (block.blockGuid === $defaultBlockGuid) {
				$defaultBlockGuid = $liveBlocks?.[0]?.blockGuid;
			}

			showOptionsModal = false;
		}
	}

	function handleCopy() {
		showCopied = true;
		$copiedBlock = clone(block);
		setTimeout(() => (showCopied = false), 333);
	}

	function handleEdit() {
		showEditor = true;
		closeOptionsModal();
	}

	const Icons = {
		Music: MusicIcon,
		Person: PersonIcon,
		Chapter: ChapterIcon,
		Podcast: PodcastIcon
	};

	let typeText = block?.type?.charAt(0)?.toUpperCase() + block?.type?.slice(1) || 'Chapter';

	function handleChangeType(type) {
		block.type = type;
		typeText = type.charAt(0).toUpperCase() + type.slice(1);
		showSelectBlock = false;
		$liveBlocks = $liveBlocks;
	}
</script>

<blurred-background class="link" on:click|self={closeOptionsModal} on:keyup={closeOptionsModal}>
	<options-modal
		class:warning={!block.title ||
			block?.value?.destinations?.reduce(
				(acc, person) => acc + parseFloat(person.fee ? 0 : person.split),
				0
			) !== 100 ||
			block?.value?.destinations?.some((item) => !item.address)}
	>
		<top>
			{#if $defaultBlockGuid === block?.blockGuid}
				<button
					class="change-default"
					on:click={() => {
						$changeDefault = true;
						showOptionsModal = false;
					}}
				>
					<p>Change Default</p>
				</button>
			{:else}
				<button
					class="share"
					on:click={() => {
						showShareModal = true;
					}}
				>
					<ShareIcon size="24" />
				</button>
			{/if}
			<button class="block-type" on:click={() => (showSelectBlock = true)}>
				<icon><svelte:component this={Icons[typeText]} /></icon>
				{typeText}
			</button>
			<button class="close" on:click={closeOptionsModal}><Close size="32" /></button>
		</top>
		<img src={block?.image || '/splitkit300.png'} alt="the artwork for this block" />
		<card-text>
			<h3>
				{block?.title || ''}
			</h3>
			<p>
				{block?.line?.[0] === 'Text - click to edit' ? '' : block?.line?.[0] || ''}
			</p>
		</card-text>

		{#if !block?.value?.destinations?.length}
			<h3 class="warning">This item has no value blocks</h3>
		{:else}
			{#if block?.value?.destinations?.reduce((acc, person) => acc + parseFloat(person.fee ? 0 : person.split), 0) !== 100}
				<h3 class="warning">Splits do not add up to 100%</h3>
				{block?.value?.destinations?.reduce(
					(acc, person) => acc + parseFloat(person.fee ? 0 : person.split),
					0
				)}
			{/if}
			{#if block?.value?.destinations?.some((item) => !item.address)}
				<h3 class="warning">Value Blocks are missing addresses.</h3>
			{/if}
		{/if}
		<button-container>
			<button class="delete" on:click={handleDelete}>
				<Delete size="27" />
			</button>

			<button class="edit" on:click={handleEdit}>
				<Edit size="32" />
			</button>

			<button class="copy" on:click={handleCopy}>
				<CopyIcon size="27" />
			</button>
		</button-container>
	</options-modal>
</blurred-background>

{#if showShareModal}
	<Modal bind:showModal={showShareModal}>
		<Share eventGuid={block.eventGuid} blockGuid={block.blockGuid} />
	</Modal>
{/if}

{#if showSelectBlock}
	<Modal bind:showModal={showSelectBlock}>
		<SelectBlock {handleChangeType} />
	</Modal>
{/if}

{#if showCopied}
	<SaveModal>
		<h2>Copied</h2>
	</SaveModal>
{/if}

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	blurred-background.link {
		align-items: flex-end;
	}

	options-modal {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		position: relative;
		width: 300px;
		height: 500px;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
		margin-bottom: 100px;
	}

	options-modal.warning {
		border: 1px solid red;
		box-shadow: 0 2px 8px 0px rgba(254, 98, 98, 0.75);
	}

	top {
		display: flex;
		width: calc(100% - 8px);
		justify-content: space-between;
		height: 40px;
		padding: 4px;
		align-items: center;
	}

	top p icon {
		padding-right: 4px;
		position: relative;
	}

	top button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		width: 40px;
		border-radius: 25px;
		padding: 0;
		margin: 0;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	top .block-type {
		display: flex;
		box-shadow: none;
		background-color: transparent;
	}

	button.share {
		position: relative;
		top: 2px;
		left: 2px;
	}

	button.close {
		background-color: transparent;
		box-shadow: none;
	}

	img {
		width: 200px;
		height: 200px;
		border-radius: 8px;
	}

	card-text {
		width: 100%;
		padding: 4px;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	h3 {
		margin: 4px 0;
	}
	p {
		padding: 0;
		margin: 0;
	}

	button-container {
		width: calc(100% - 16px);
		display: flex;
		margin: 4px 8px;
		justify-content: space-between;
		align-items: center;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	button.delete {
		color: var(--color-text-1);
		background-color: hsl(0, 100%, 32%);
	}

	button.edit {
		min-height: 50px;
		min-width: 50px;
		color: var(--color-text-0);
		background-color: hsl(38, 100%, 61%);
	}

	button.copy {
		background-color: var(--color-theme-blue);
	}

	h3.warning {
		color: red;
	}

	.change-default {
		color: var(--color-text-purple);
		background-color: var(--color-theme-purple);
	}

	.change-default p {
		font-size: 0.75em;
	}
</style>
