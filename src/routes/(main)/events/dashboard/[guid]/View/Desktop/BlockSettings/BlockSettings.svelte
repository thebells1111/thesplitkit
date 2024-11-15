<script>
	import BlockValueSplit from './BlockValueSplit.svelte';
	import TimeInputs from '$lib/TimeInputs/TimeInputs.svelte';
	import AudioUrl from './AudioUrl.svelte';
	import Chapters from './Chapters.svelte';
	import BlockInfo from '../BlockInfo/BlockInfo.svelte';
	import BlockPreview from '../BlockPreview/BlockPreview.svelte';
	import BlockID from './BlockID.svelte';

	import { defaultBlockGuid } from '$/stores';

	export let block;
	export let downloadMP3 = () => {};
</script>

<editing-container>
	<left>
		{#if block?.blockGuid !== $defaultBlockGuid}
			<BlockValueSplit bind:block />
			<AudioUrl bind:block {downloadMP3} />
			{#if block?.chaptersUrl}
				<Chapters bind:block />
			{/if}
			<time-settings>
				<div>
					<TimeInputs bind:block bind:time={block.startTime} title="Start Time" small={true} />
				</div>
				<div>
					<TimeInputs
						bind:block
						bind:time={block.duration}
						title="Block Playback Duration"
						small={true}
					/>
				</div>
			</time-settings>
		{/if}
		<BlockID {block} />
	</left>
	<right>
		<BlockInfo bind:block />
	</right>
</editing-container>

<style>
	editing-container {
		display: flex;
		width: 100%;
		margin-top: 8px;
	}

	left,
	right {
		display: block;
		width: calc(50% - 16px);
		margin: 0 8px;
	}

	time-settings {
		display: flex;
		margin: 0 0 8px 0;
	}

	time-settings > div {
		width: calc(50% - 8px);
		margin: 0 8px 0 0;
	}

	time-settings > div:nth-of-type(2) {
		width: calc(50% - 8px);
		margin: 0 0 0 8px;
	}
</style>
