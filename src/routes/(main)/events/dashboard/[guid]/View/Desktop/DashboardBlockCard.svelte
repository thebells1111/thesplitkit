<script>
	import { tick } from 'svelte';
	import formatTime from '$functions/formatTime.js';
	import getMediaDuration from '$functions/getMediaDuration.js';

	import BlockSettings from './BlockSettings/BlockSettings.svelte';
	import BlockFooter from './BlockFooter/BlockFooter.svelte';

	import BroadcastIcon from '$lib/icons/Broadcast.svelte';
	import TimerIcon from '$lib/icons/Timer.svelte';

	import { defaultBlockGuid, mainSettings, liveBlocks, addedBlockGuid } from '$/stores';

	export let showEditing = false;
	export let block = {};
	export let index;
	export let broadcastingBlockGuid;
	export let broadcastTimeRemaining;
	export let handleBroadcast = () => {};
	export let updateStartTime = () => {};
	export let downloadMP3 = () => {};
	export let handleDeleteBlock = () => {};
	export let handleCopyBlock = () => {};
	export let expandAll = false;

	$: if ($addedBlockGuid === block.blockGuid) {
		showEditing = true;
		setTimeout(() => {
			$addedBlockGuid = null;
		}, 0);
	}

	function broadcast(block) {
		if (broadcastingBlockGuid !== block?.blockGuid) {
			handleBroadcast(block);
		}
	}

	async function saveBlock(block) {
		if (block.enclosureUrl && !$mainSettings?.lowBandwidth?.audio) {
			if (!block.duration) {
				try {
					block.duration = await getMediaDuration(block.enclosureUrl);
				} catch (error) {
					block.duration = 0;
				}
			} else {
				block.duration = 0;
			}
		}

		let activeIndex = $liveBlocks.findIndex((v) => v?.blockGuid === block?.blockGuid);
		if (activeIndex > -1) {
			$liveBlocks[activeIndex] = block;
		}
	}

	$: toggleEditor(expandAll);

	function toggleEditor(expandAll) {
		showEditing = expandAll;
	}
</script>

{#if block}
	<div
		class:active={broadcastingBlockGuid === block?.blockGuid}
		class:default={$defaultBlockGuid === block?.blockGuid}
		class:warning={!(
			$mainSettings?.broadcastMode === 'edit' && block?.blockGuid === $defaultBlockGuid
		) &&
			(block?.value?.destinations?.reduce(
				(acc, person) => acc + parseFloat(person.fee ? 0 : person.split),
				0
			) !== 100 ||
				block.value.destinations.some((item) => !item.address))}
	>
		{#if block?.blockGuid === $defaultBlockGuid}
			<default>-default block-</default>
		{/if}

		<card-info>
			{#if !$mainSettings?.lowBandwidth?.images}
				<img src={block.image || '/splitkit300.png'} alt="the artwork for this block" />
			{:else}
				<img src={'/splitkit300.png'} alt="the artwork for this block" />
			{/if}

			<card-text>
				<h3>{block.title === 'Title - click to edit' ? '' : block.title || ''}</h3>
				<p>{block?.line?.[0] === 'Text - click to edit' ? '' : block?.line?.[0] || ''}</p>
				<p>{block?.line?.[1] === 'Text - click to edit' ? '' : block?.line?.[1] || ''}</p>
			</card-text>
			<card-values>
				<block-value>
					{block?.blockGuid === $defaultBlockGuid ? 100 : block.settings.split}%
				</block-value>
			</card-values>
		</card-info>

		<time-container>
			{#if ['playlist', 'edit'].find((v) => v === $mainSettings.broadcastMode) || $mainSettings?.broadcastMode === 'podcast'}
				{#if block?.blockGuid !== $defaultBlockGuid}
					<start-time>
						<h4>Start:</h4>
						<p>{block.startTime ? formatTime(block.startTime) : ''}</p>
					</start-time>
					<duration>
						<h4>Duration:</h4>
						{#if ($mainSettings?.broadcastMode === 'playlist' || ($mainSettings?.broadcastMode === 'podcast' && $mainSettings?.podcast?.autoSwitch)) && !block.duration}
							<p class="warning">No duration!</p>
						{:else}
							<p>{block.duration ? formatTime(block.duration) : ''}</p>
						{/if}
					</duration>
					{#if broadcastingBlockGuid === block?.blockGuid}
						<time-remaining>
							<h4>Time Remaining:</h4>
							<p>{broadcastTimeRemaining > 0 ? formatTime(broadcastTimeRemaining) : '∞'}</p>
						</time-remaining>
					{/if}
				{/if}
			{/if}
		</time-container>

		<bottom-container>
			<button
				class="editor-toggle"
				on:click={() => {
					showEditing = !showEditing;
				}}
			>
				{showEditing ? 'close editor' : 'open editor'}
			</button>
			{#if ['edit'].find((v) => v === $mainSettings?.broadcastMode)}
				<button class="broadcast" on:click={updateStartTime.bind(this, block, index)}
					><TimerIcon size="32" /></button
				>
			{:else if ['playlist'].find((v) => v === $mainSettings?.broadcastMode) && block?.blockGuid === $defaultBlockGuid}
				<span />
			{:else}
				<button class="broadcast" on:click={broadcast.bind(this, block, index)}
					><BroadcastIcon size="32" /></button
				>
			{/if}
		</bottom-container>

		{#if $mainSettings?.broadcastMode === 'playlist' && !block.enclosureUrl && block?.blockGuid !== $defaultBlockGuid}
			<warning>This block has no audio file.</warning>
		{/if}
		{#if !block?.value?.destinations?.length && !($mainSettings?.broadcastMode === 'edit' && block?.blockGuid === $defaultBlockGuid)}
			<warning>This item has no value blocks</warning>
		{/if}

		<editor class:show={showEditing}>
			<BlockSettings bind:block {downloadMP3} />
			<BlockFooter {block} {handleDeleteBlock} {handleCopyBlock} />
		</editor>
	</div>
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

	img {
		width: 60px;
		height: 60px;
		object-fit: cover;
	}
	card-text {
		width: 100%;
		margin-left: 4px;
	}

	card-values {
		display: block;
	}

	time-container {
		margin-top: 4px;
		display: flex;
		height: 18px;
	}

	start-time,
	duration,
	time-remaining {
		display: flex;
		margin-right: 16px;
	}

	time-remaining {
		flex: 1;
		justify-content: flex-end;
		margin-right: 8px;
	}

	time-container h4 {
		margin: 0;
	}

	time-container p {
		margin: 0;
		padding: 0 0 0 8px;
	}

	p.warning {
		font-weight: bold;
		color: red;
		width: 100%;
	}

	block-value {
		display: block;
		text-align: right;
	}

	div.default {
		background-color: var(--color-theme-light-purple);
		margin-bottom: 16px;
	}

	div.active {
		background-color: var(--color-theme-light-blue);
		box-shadow: 0 0px 8px 1px rgba(0, 131, 179, 0.75);
	}

	default {
		position: absolute;
		top: -1px;
		left: calc(50% - 50px);
		color: var(--color-theme-purple);
		font-weight: bold;
	}
	div.warning {
		border: 1px solid red;
		box-shadow: 0 0px 8px 1px rgba(254, 98, 98, 0.75);
	}

	card-info {
		display: flex;
		margin-bottom: 4px;
		width: 100%;
	}

	h3,
	p {
		margin: 0;
		padding: 0;
	}

	bottom-container {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		width: 100%;
	}

	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		margin: 0 8px 8px 0;
		border-radius: 25px;
		padding: 0;
	}

	button.editor-toggle {
		color: var(--color-text-0);
		background-color: hsl(38, 100%, 61%);
		width: 150px;
		height: initial;
		margin: 0 0 8px 8px;
	}

	button.broadcast {
		color: var(--color-text-1);
		background-color: rgb(0, 132, 180);
	}

	editor {
		display: none;
	}

	.show {
		display: block;
	}
</style>
