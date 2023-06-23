<script>
	import BlockSettings from '../../broadcaster/[guid]/BlockSettings/BlockSettings.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import BroadcastIcon from '$lib/icons/Broadcast.svelte';

	import EditIcon from '$lib/icons/Edit.svelte';
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
	export let activeBlockGuid;
	export let showOptionsModal = true;
	export let handleBroadcast = () => {};
	export let broadcastMethod = '';

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

	function formatTime(timeInSeconds) {
		let totalMilliseconds = timeInSeconds * 1000;
		let hours = Math.floor(timeInSeconds / 3600);
		let minutes = Math.floor((timeInSeconds % 3600) / 60);
		let seconds = Math.floor(timeInSeconds % 60);
		let milliseconds = Math.floor(totalMilliseconds % 1000);

		let formattedTime = '';

		if (hours > 0) {
			formattedTime += `${hours}:`;
		}

		if (minutes < 10 && hours > 0) {
			formattedTime += `0${minutes}:`;
		} else {
			formattedTime += `${minutes}:`;
		}

		if (seconds < 10) {
			formattedTime += `0${seconds}`;
		} else {
			formattedTime += `${seconds}`;
		}

		// Include milliseconds as a three-digit decimal
		formattedTime += `.${milliseconds.toString().padStart(3, '0')}`;

		return formattedTime;
	}
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
		<bottom-container>
			<time-container>
				{#if ['playlist', 'post'].find((v) => v === broadcastMethod)}
					<duration>
						<strong>Duration:</strong>
						<span>{block.duration ? formatTime(block.duration) : ''}</span>
					</duration>
					<start-time>
						<strong>Start:</strong>
						<span>{block.startTime ? formatTime(block.startTime) : ''}</span>
					</start-time>
				{/if}
			</time-container>
			<button-container>
				<button
					class="edit"
					on:click={() => {
						showOptionsModal = true;
						activeBlockGuid = block.blockGuid;
					}}
				>
					<EditIcon size="27" /></button
				>
				<button class="tuner" on:click={() => (showSettingsModal = true)}>
					<TunerIcon size="27" />
				</button>
				<button class="broadcast" on:click={broadcast.bind(this, block, index)}
					><BroadcastIcon size="32" /></button
				>
			</button-container>
		</bottom-container>
		<block-value
			>{block.blockGuid === $defaultBlockGuid ? 100 : block.settings.split}% value to default block</block-value
		>
	</div>
{/if}

{#if showSettingsModal}
	<Modal bind:showModal={showSettingsModal}>
		<BlockSettings bind:block {activeBlockGuid}/>
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

	strong {
		margin-right: 4px;
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

	bottom-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	time-container {
		display: flex;
		flex-direction: column;
		width: 50%;
	}

	button-container {
		display: flex;
		width: calc(50% - 8px);
		justify-content: flex-end;
	}

	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		margin-left: 8px;
		border-radius: 25px;
		padding: 0;
	}

	button.edit {
		color: var(--color-text-0);
		background-color: hsl(38, 100%, 61%);
	}
	button.tuner {
		color: var(--color-text-1);
		background-color: rgb(0, 132, 180);
	}

	button.broadcast {
		color: hsl(278, 100%, 92%);
		background-color: hsl(277, 100%, 44%);
	}

	block-value {
		display: block;
		width: 100%;
		text-align: center;
	}

	@media screen and (max-width: 399px) {
		button {
			height: 45px;
			width: 45px;
		}
	}
</style>
