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
		>{#if publisherFeedType === 'publisher'}
			Download Feed
		{:else}
			Episode Info
		{/if}
	</button>
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		overflow: auto;
		height: calc(100% - 40px);
	}
	button-container {
		margin: 8px 8px 0px 8px;
		display: flex;
		justify-content: space-between;
	}
</style>
