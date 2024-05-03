<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let screenIndex;
	export let feed;
	export let item;
	export let showFeedModal;
	export let publisherFeedType;
	console.log(item);
</script>

<container>
	<ValueBlock bind:data={feed} {feed} />
</container>

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Podcast Info</button
	>

	<button
		on:click={() => {
			screenIndex++;
		}}
		>{#if publisherFeedType === 'podcast'}
			Episode Info
		{:else if publisherFeedType === 'publisher'}
			Download Feed
		{/if}
	</button>
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
		overflow: auto;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}
</style>
