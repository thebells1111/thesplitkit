<script>
	import Settings from '$lib/icons/Settings.svelte';
	import Share from '$lib/icons/Share.svelte';
	import Filter from '$lib/icons/Filter.svelte';
	import AddBlocks from '$lib/icons/AddBlocks.svelte';
	import { page } from '$app/stores';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	export let showShareModal;
	export let showMainSettingsModal;
	export let showFilterModal;
	export let showSelectBlock;

	import clone from 'just-clone';
	import Save from '$lib/icons/Save.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';

	import { remoteServer, liveBlocks } from '$/stores';

	export let filterType;
	export let mainUnsaved = false;
	let initialized = false;
	let savedBlocks = [];
	let showSaved = false;

	const Icons = {
		music: MusicIcon,
		person: PersonIcon,
		chapter: ChapterIcon,
		podcast: PodcastIcon
	};

	$: compareBlocks($liveBlocks);

	function compareBlocks(blocks) {
		if (JSON.stringify(blocks) !== JSON.stringify(savedBlocks)) {
			savedBlocks = clone(blocks);
			if (initialized) {
				mainUnsaved = true;
			} else {
				initialized = true;
			}
		}
	}

	function submitData() {
		showSaved = true;
		setTimeout(() => (showSaved = false), 500);
		const newBlocks = $liveBlocks.map((block) => {
			const newBlock = clone(block);
			newBlock.line = newBlock.line
				.map((v) => {
					if (v !== 'Text - click to edit') {
						return v;
					} else {
						return '';
					}
				})
				.filter((v) => v);

			if (newBlock?.title === 'Title - click to edit') {
				newBlock.title = '';
			}
			if (newBlock?.link?.text === 'Link - click to edit') {
				newBlock.link.text = '';
			}
			if (!newBlock?.link?.text || !newBlock?.link?.url) {
				newBlock.link = { text: '', url: '' };
			}
			return newBlock;
		});

		saveEntry(newBlocks);
		mainUnsaved = false;
	}

	function saveEntry(blocks) {
		fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
			})
			.catch((error) => console.error(error));
	}
</script>

<header>
	<button class="save" class:unsaved={mainUnsaved} type="submit" on:click={submitData}>
		<Save size="32" />
	</button>

	<button
		class="filter-button"
		class:filtered={filterType !== 'off'}
		on:click={() => (showFilterModal = true)}
	>
		{#if filterType !== 'off'}
			<icon>
				<svelte:component this={Icons[filterType]} />
			</icon>
		{/if}
		<Filter size="32" />
	</button>

	<button class="add-block" on:click={() => (showSelectBlock = true)}>
		<AddBlocks size="36" />
	</button>

	<button on:click={() => (showShareModal = true)}>
		<Share size="32" />
	</button>

	<button on:click={() => (showMainSettingsModal = true)}>
		<Settings size="32" />
	</button>
</header>

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	header {
		width: 100%;
		max-width: 450px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 8px auto;
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

	.filtered {
		background-color: antiquewhite;
	}

	.unsaved {
		animation: heartbeat 1s infinite;
		z-index: 2;
	}

	.filter-button {
		position: relative;
	}

	icon {
		position: absolute;
		bottom: 4px;
		right: 4px;
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
