<script>
	import Share from '$lib/Share/Share.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import Edit from '$lib/icons/Edit.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import ShareIcon from '$lib/icons/Share.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import clone from 'just-clone';

	import { defaultBlockGuid, liveBlocks, copiedBlock, changeDefault, mainSettings } from '$/stores';

	export let block;
	export let showEditor;
	let showCopied = false;

	let showShareModal = false;

	function handleDelete() {
		let confirmation = confirm(
			'Are you sure you want to delete ' + (block?.line?.[0] || 'this block?')
		);
		if (confirmation) {
			$liveBlocks = $liveBlocks.filter((v) => v?.blockGuid !== block?.blockGuid);
			if (block?.blockGuid === $defaultBlockGuid) {
				$defaultBlockGuid = null;
				$liveBlocks.unshift(null);
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

<top>
	{#if $defaultBlockGuid === block?.blockGuid}
		<button
			class="change-default"
			on:click={() => {
				$changeDefault = true;
			}}
		>
			<p>Set as Default</p>
		</button>
	{/if}
</top>

{#if !$mainSettings?.lowBandwidth?.images}
	<img src={block?.image || '/splitkit300.png'} alt="the artwork for this block" />
{:else}
	<img src={'/splitkit300.png'} alt="the artwork for this block" />
{/if}
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

{#if showShareModal}
	<Modal bind:showModal={showShareModal}>
		<Share eventGuid={block.eventGuid} blockGuid={block?.blockGuid} promotion={true} />
	</Modal>
{/if}

{#if showCopied}
	<SaveModal>
		<h2>Copied</h2>
	</SaveModal>
{/if}

<style>
	top {
		display: flex;
		width: calc(100% - 8px);
		justify-content: space-between;
		height: 40px;
		padding: 4px;
		align-items: center;
		position: relative;
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
		position: absolute;
		top: 64px;
	}

	.change-default p {
		font-size: 0.75em;
	}
</style>
