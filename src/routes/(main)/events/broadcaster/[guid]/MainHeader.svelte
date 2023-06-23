<script>
	import Settings from '$lib/icons/Settings.svelte';
	import AddBlocks from '$lib/icons/AddBlocks.svelte';
	import Share from '$lib/icons/Share.svelte';
	import Filter from '$lib/icons/Filter.svelte';
	import { page } from '$app/stores';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	export let showShareModal;
	export let showMainSettingsModal;
	export let showFilterModal;
	export let filterType;

	const Icons = {
		music: MusicIcon,
		person: PersonIcon,
		chapter: ChapterIcon,
		podcast: PodcastIcon
	};
</script>

<header>
	<button on:click={() => (showMainSettingsModal = true)}>
		<Settings size="32" />
	</button>

	<button
		class="filter-button"
		class:filtered={filterType !== 'off'}
		on:click={() => (showFilterModal = true)}
	>
		<Filter size="32" />
		{#if filterType !== 'off'}
			<icon>
				<svelte:component this={Icons[filterType]} />
			</icon>
		{/if}
	</button>
	<button on:click={() => (showShareModal = true)}>
		<Share size="32" />
	</button>

	<a href={'/events/creator/' + $page.params.guid}><AddBlocks size="32" /></a>
</header>

<style>
	header {
		width: 100%;
		max-width: 450px;
		display: flex;
		justify-content: space-between;
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
		margin: 0 16px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	.filtered {
		background-color: antiquewhite;
	}

	.filter-button {
		position: relative;
	}

	icon {
		position: absolute;
		bottom: 4px;
		right: 4px;
	}
</style>
