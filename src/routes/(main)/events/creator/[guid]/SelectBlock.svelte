<script>
	import AddFeed from './AddFeed.svelte';
	import AddMusic from './AddMusic/AddMusic.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	export let addBlock = () => {};
	export let addFeed = () => {};
	export let blockType;
	export let changeType = () => {};

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

	function handleSelect(type) {
		resetModals();
		changeType(type);

		if (modalsConfig.hasOwnProperty(type)) {
			blockType = type;
			modalsConfig[type].show = true;

			if (['person', 'chapter'].find((v) => type === v)) {
				addBlock(type);
			}
		} else {
			console.error(`Modal type ${type} is not defined`);
		}
	}
</script>

{#if modalsConfig.podcast.show}
	<AddFeed {addFeed} />
{:else if modalsConfig.music.show}
	<AddMusic {addFeed} />
{:else}
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
	</div>
{/if}

<style>
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
