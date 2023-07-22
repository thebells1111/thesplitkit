<script>
	import AddFeed from './AddFeed.svelte';
	import AddMusic from './AddMusic/AddMusic.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import clone from 'just-clone';

	import { tick } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	import { copiedBlock, liveBlocks, blocksList, changeDefault } from '$/stores';

	export let addBlock = () => {};
	export let addFeed = () => {};
	export let handleChangeType = null;
	export let showSelectBlock;

	let modalsConfig = {
		podcast: { show: false },
		chapter: { show: false },
		person: { show: false },
		music: { show: false }
		// add other modals here
	};

	function resetModals() {
		for (let key in modalsConfig) {
			modalsConfig[key].show = false;
		}
	}

	async function handleSelect(type) {
		resetModals();
		if (handleChangeType) {
			handleChangeType(type);
		}

		if (modalsConfig.hasOwnProperty(type)) {
			modalsConfig[type].show = true;

			if (['person', 'chapter'].find((v) => type === v)) {
				addBlock(type);
			}
		} else {
			if (['paste'].find((v) => v === type)) {
				await pasteBlock();
			}
		}
	}

	async function pasteBlock() {
		showSelectBlock = false;
		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

		let block = clone($copiedBlock);
		block.blockGuid = blockGuid;

		$liveBlocks = $liveBlocks.concat(block);
		console.log($copiedBlock);

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

		await tick();
		$blocksList.scrollTo({ top: $blocksList.scrollHeight, behavior: 'smooth' });
	}
</script>

{#if modalsConfig.podcast.show}
	<AddFeed {addFeed} />
{:else if modalsConfig.music.show}
	<AddMusic {addFeed} />
{:else}
	{#if $changeDefault}
		<h1>Default Block</h1>
	{/if}
	<h2>Select Block Type</h2>

	<div>
		<button on:click={handleSelect.bind(this, 'chapter')}>
			<icon>
				<ChapterIcon size="40" />
			</icon>
			Chapter
		</button>
		<button on:click={handleSelect.bind(this, 'music')}>
			<icon>
				<MusicIcon size="40" />
			</icon>
			Music
		</button>
		<button on:click={handleSelect.bind(this, 'podcast')}>
			<icon>
				<PodcastIcon size="40" />
			</icon>
			Podcast
		</button>
		<button on:click={handleSelect.bind(this, 'person')}>
			<icon>
				<PersonIcon size="40" />
			</icon>
			Person
		</button>
		{#if $copiedBlock && !handleChangeType}
			<button on:click={handleSelect.bind(this, 'paste')}>
				<icon>
					<CopyIcon size="40" />
				</icon>
				Paste
			</button>
		{/if}
	</div>
{/if}

<style>
	h1 {
		margin: 0;
		color: var(--color-theme-purple);
	}
	h2 {
		color: var(--color-theme-blue);
	}
	div {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	button {
		box-shadow: none;
		background-color: transparent;
		color: var(--color-text-0);
		display: flex;
		flex-direction: column;
	}

	icon {
		display: block;
		width: 50px;
		height: 50px;
		background-color: hsl(0, 0%, 96%);
		border-radius: 25px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
