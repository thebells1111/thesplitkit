<script>
	export let block = {};
	export let index;
	export let editingBlockIndex;
	export let showOptionsModal = true;
	import EditIcon from '$lib/icons/Edit.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	import { defaultBlockGuid } from '$/stores';

	const Icons = {
		Music: MusicIcon,
		Person: PersonIcon,
		Chapter: ChapterIcon,
		Podcast: PodcastIcon
	};

	$: typeText =
		(block && block?.type?.charAt(0)?.toUpperCase() + block?.type?.slice(1)) || 'Chapter';
</script>

<div
	on:click={() => {
		showOptionsModal = true;
		editingBlockIndex = index;
	}}
	on:keyup={() => {
		showOptionsModal = true;
		editingBlockIndex = index;
	}}
	class:warning={block.value.destinations.reduce(
		(acc, person) => acc + parseFloat(person.fee ? 0 : person.split),
		0
	) !== 100 || block.value.destinations.some((item) => !item.address)}
>
	{#if block.blockGuid === $defaultBlockGuid}
		<default>-default block-</default>
	{/if}
	<img
		src={block.image || '/splitkit300.png'}
		alt="the artwork for this block"
		height="50"
		width="50"
	/>
	<card-text>
		<h3>{block.title}</h3>
		<p>
			{block?.line?.[0] === 'Text - click to edit' ? '' : block.line[0] || ''}
		</p>
	</card-text>

	<p class="block-type"><icon><svelte:component this={Icons[typeText]} /></icon></p>
	<p class="edit-icon"><EditIcon size="27" /></p>
</div>

<style>
	div {
		padding: 4px 4px 4px 4px;
		display: flex;
		align-items: center;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		margin: 4px 8px;
		position: relative;
		border: 1px solid transparent;
	}

	default {
		position: absolute;
		top: -1px;
		left: calc(50% - 50px);
		color: gray;
		z-index: -1;
	}

	div.warning {
		border: 1px solid red;
		box-shadow: 0 2px 8px 0px rgba(254, 98, 98, 0.75);
	}

	div:first-child {
		margin-top: 8px; /* Adjust the top margin value as needed */
	}

	div:last-child {
		margin-bottom: 72px; /* Adjust the bottom margin value as needed */
	}

	img {
		width: 50px;
		aspect-ratio: auto;
	}

	h3,
	p {
		margin: 0;
		padding: 6px;
	}

	h3 {
		padding-top: 12px;
	}

	card-text {
		flex: 1;
	}

	.block-type {
		display: flex;
		position: absolute;
		top: -4px;
		right: 0;
	}

	.block-type icon {
		padding-right: 4px;
	}

	.edit-icon {
		position: relative;
		align-self: flex-end;
		bottom: -8px;
		right: -4px;
	}
</style>
