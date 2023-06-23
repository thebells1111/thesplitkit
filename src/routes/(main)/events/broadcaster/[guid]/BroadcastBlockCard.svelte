<script>
	import BlockSettings from './BlockSettings/BlockSettings.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import BroadcastIcon from '$lib/icons/Broadcast.svelte';
	import TunerIcon from '$lib/icons/Tuner.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import { defaultBlockGuid } from '$/stores';
	export let block = {};
	export let index;
	export let broadcastingBlockIndex;
	export let showSettingsModal = false;
	export let handleBroadcast = () => {};

	function broadcast(block, index) {
		broadcastingBlockIndex = index;
		handleBroadcast(block);
	}

	const Icons = {
		Music: MusicIcon,
		Person: PersonIcon,
		Chapter: ChapterIcon,
		Podcast: PodcastIcon
	};

	$: typeText =
		(block && block?.type?.charAt(0)?.toUpperCase() + block?.type?.slice(1)) || 'Chapter';
</script>

{#if block}
	<div
		class:active={broadcastingBlockIndex === index}
		class:warning={block.value.destinations.reduce(
			(acc, person) => acc + parseFloat(person.fee ? 0 : person.split),
			0
		) !== 100 || block.value.destinations.some((item) => !item.address)}
	>
		{#if block.blockGuid === $defaultBlockGuid}
			<default>-default block-</default>
		{/if}

		<card-info>
			<img src={block.image || '/splitkit300.png'} alt="the artwork for this block" />
			<card-text>
				<top>
					<h3>{block.title === 'Title - click to edit' ? '' : block.title || ''}</h3>
					<p class="block-type"><icon><svelte:component this={Icons[typeText]} /></icon></p>
				</top>

				<p>{block.line[0] === 'Text - click to edit' ? '' : block.line[0] || ''}</p>
			</card-text>
		</card-info>
		<button-container>
			<left>
				<button on:click={() => (showSettingsModal = true)}>
					<TunerIcon size="27" />
				</button>
			</left>
			<middle>
				{#if block.blockGuid === $defaultBlockGuid}
					<p>100% value to default block</p>
				{:else}
					<p>{100 - block.settings.split}% value to default block</p>
					<p>{block.settings.split}% value to this block</p>
				{/if}
			</middle>
			<right>
				<button on:click={broadcast.bind(this, block, index)}><BroadcastIcon size="32" /></button>
			</right>
		</button-container>
	</div>
{/if}

{#if showSettingsModal}
	<Modal bind:showModal={showSettingsModal}>
		<BlockSettings bind:block />
	</Modal>
{/if}

<style>
	div {
		padding: 4px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		margin: 4px 8px;
		border: 1px solid transparent;
		position: relative;
	}

	div.active {
		background-color: antiquewhite;
	}

	default {
		position: absolute;
		top: -1px;
		left: calc(50% - 50px);
		color: gray;
	}
	div.warning {
		border: 1px solid red;
		box-shadow: 0 2px 8px 0px rgba(254, 98, 98, 0.75);
	}

	card-info {
		display: flex;
		margin-bottom: 4px;
		width: 100%;
	}
	card-text {
		width: 100%;
	}

	top {
		display: flex;
		width: 100%;
		margin-top: 2px;
	}
	top h3 {
		width: 100%;
	}

	div:first-child {
		margin-top: 8px; /* Adjust the top margin value as needed */
	}

	div:last-child {
		margin-bottom: 72px; /* Adjust the bottom margin value as needed */
	}

	img {
		width: 60px;
	}

	h3,
	p {
		margin: 0;
		padding: 6px;
	}

	button-container {
		display: flex;
		margin-bottom: 4px;
		width: 100%;
	}

	button-container {
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		margin: 4px;
		width: calc(100% - 8px);
	}

	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 25px;
		padding: 0;
	}

	left,
	middle,
	right {
		display: flex;
	}

	middle {
		justify-content: flex-end;
		align-items: center;
		flex-direction: column;
	}

	middle p {
		padding: 0;
	}

	right {
		justify-content: flex-end;
	}
</style>
