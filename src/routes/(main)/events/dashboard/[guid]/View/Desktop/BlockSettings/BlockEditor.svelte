<script>
	import BlockValueSplit from './BlockValueSplit.svelte';
	import TimeInputs from '$lib/TimeInputs/TimeInputs.svelte';
	import AudioUrl from './AudioUrl.svelte';
	import Chapters from './Chapters.svelte';
	import BlockPreview from '../BlockPreview.svelte';
	import BlockID from './BlockID.svelte';

	import { defaultBlockGuid } from '$/stores';
	import BlockId from './BlockID.svelte';

	export let block;
</script>

<editing-container>
	<left>
		<BlockId {block} />
		{#if block?.blockGuid !== $defaultBlockGuid}
			<BlockValueSplit bind:block />
			<AudioUrl bind:block />
			{#if block?.chaptersUrl}
				<Chapters bind:block />
			{/if}
			<time-settings>
				<div>
					<TimeInputs bind:block bind:time={block.startTime} title="Start Time" />
				</div>
				<div>
					<TimeInputs bind:block bind:time={block.duration} title="Block Playback Duration" />
				</div>
			</time-settings>
		{/if}
	</left>
	<right>
		<BlockPreview bind:block />
	</right>
</editing-container>

<style>
	editing-container {
		display: flex;
		width: 100%;
		margin-top: 8px;
	}

	time-settings {
		display: flex;
		margin: 0;
	}

	left,
	right {
		display: block;
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	time-settings > div {
		margin: 0 16px;
	}
</style>
