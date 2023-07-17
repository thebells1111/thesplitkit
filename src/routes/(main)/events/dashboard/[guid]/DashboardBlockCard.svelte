<script>
	import { page } from '$app/stores';
	import BlockSettings from '$lib/Settings/BlockSettings/BlockSettings.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import BroadcastIcon from '$lib/icons/Broadcast.svelte';

	import EditIcon from '$lib/icons/Edit.svelte';
	import TunerIcon from '$lib/icons/Tuner.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import PersonIcon from '$lib/icons/Person.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import TimerIcon from '$lib/icons/Timer.svelte';
	import { remoteServer, defaultBlockGuid, mainSettings, liveBlocks } from '$/stores';

	import getMediaDuration from '$lib/functions/getMediaDuration.js';

	export let block = {};
	export let index;
	export let broadcastingBlockGuid;
	export let showSettingsModal = false;
	export let activeBlockGuid;
	export let showOptionsModal = true;
	export let broadcastTimeRemaining;
	export let handleBroadcast = () => {};
	export let updateStartTime = () => {};

	function broadcast(block) {
		if (broadcastingBlockGuid !== block.blockGuid) {
			handleBroadcast(block);
		}
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

	function moveElement(index, direction) {
		console.log(index);
		console.log(direction);
		console.log(index + direction);
		console.log($liveBlocks);
		if (index + direction >= $liveBlocks.length || index + direction < 1) {
			// The element is already at the boundary (start/end), so do nothing.
			// This is indexed at one to handle the default block
			return;
		}

		// Swap the element at index with the one at index+direction
		let temp = $liveBlocks[index];
		let moved = $liveBlocks[index + direction];
		$liveBlocks[index] = moved;
		$liveBlocks[index + direction] = temp;
		$liveBlocks = $liveBlocks;
	}

	async function saveBlock(block) {
		if (block.enclosureUrl && !block.duration) {
			try {
				block.duration = await getMediaDuration(block.enclosureUrl);
			} catch (error) {
				block.duration = 0;
			}
		}

		let activeIndex = $liveBlocks.findIndex((v) => v.blockGuid === block.blockGuid);
		if (activeIndex > -1) {
			$liveBlocks[activeIndex] = block;
		}

		fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks: $liveBlocks, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
			})
			.catch((error) => console.error(error));
	}
</script>

{#if block}
	<div
		class:active={broadcastingBlockGuid === block.blockGuid}
		class:default={$defaultBlockGuid === block.blockGuid}
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
		<middle-container>
			<time-container>
				{#if $mainSettings?.broadcastMode === 'playlist' || ($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch)}
					<duration>
						{#if block.blockGuid === $defaultBlockGuid}
							{#if block.duration}
								<warning>Remove the duration for this block.</warning>
							{:else}
								<warning>Default Block. No duration needed.</warning>
							{/if}
						{:else}
							<strong>Duration:</strong>

							{#if ($mainSettings?.broadcastMode === 'playlist' || ($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch)) && !block.duration}
								<warning>This block has no duration.</warning>
							{:else}
								<span>{block.duration ? formatTime(block.duration) : ''}</span>
							{/if}
						{/if}
					</duration>
					<start-time>
						<strong>Start:</strong>
						<span>{block.startTime ? formatTime(block.startTime) : ''}</span>
					</start-time>

					{#if broadcastingBlockGuid === block.blockGuid}
						<time-remaing>
							<strong>Time Remaining:</strong>
							{broadcastTimeRemaining > 0 ? formatTime(broadcastTimeRemaining) : '∞'}
						</time-remaing>
					{/if}
				{:else if ['edit'].find((v) => v === $mainSettings?.broadcastMode)}
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
				{#if ['edit'].find((v) => v === $mainSettings?.broadcastMode)}
					<button class="broadcast" on:click={updateStartTime.bind(this, block, index)}
						><TimerIcon size="32" /></button
					>
				{:else}
					<button class="broadcast" on:click={broadcast.bind(this, block, index)}
						><BroadcastIcon size="32" /></button
					>
				{/if}
			</button-container>
			<rearranger />
		</middle-container>
		<bottom-container>
			<button
				class="navigator up"
				class:default={$defaultBlockGuid === block.blockGuid || index === 0}
				on:click={moveElement.bind(this, index + 1, -1)}>▲</button
			><block-value
				>{block.blockGuid === $defaultBlockGuid ? 100 : block.settings.split}% value to this block
				when active</block-value
			>
			<button
				class="navigator down"
				class:default={$defaultBlockGuid === block.blockGuid || index === $liveBlocks?.length - 2}
				on:click={moveElement.bind(this, index + 1, 1)}>▼</button
			>
		</bottom-container>
		{#if $mainSettings?.broadcastMode === 'playlist' && !block.enclosureUrl}
			<warning>This block has no audio file.</warning>
		{/if}
	</div>
{/if}

{#if showSettingsModal}
	<Modal bind:showModal={showSettingsModal} onClose={saveBlock.bind(this, block)}>
		<BlockSettings bind:block {activeBlockGuid} />
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

	div.default {
		background-color: var(--color-theme-light-blue);
		margin-bottom: 16px;
	}

	div.active {
		background-color: var(--color-theme-light-yellow);
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
		height: 60px;
		object-fit: cover;
	}

	h3,
	p {
		margin: 0;
		padding: 6px;
	}

	middle-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	bottom-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 16px;
	}

	time-container {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	button-container {
		display: flex;
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
		color: hsl(278, 100%, 92%);
		background-color: hsl(277, 100%, 44%);
	}

	button.broadcast {
		color: var(--color-text-1);
		background-color: rgb(0, 132, 180);
	}

	block-value {
		display: block;
		width: 100%;
		text-align: center;
	}

	warning {
		font-weight: bold;
		color: red;
		width: 100%;
		text-align: center;
	}

	.navigator {
		margin: 0;
		height: initial;
		box-shadow: none;
		border-radius: 0;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 1.2em;
		background-color: transparent;
	}

	.navigator.down {
		justify-content: flex-end;
	}

	.navigator.default {
		visibility: hidden;
	}

	@media screen and (max-width: 399px) {
		button {
			height: 45px;
			width: 45px;
		}
	}
</style>
