<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let screenIndex;
	export let feed;
	export let item;
	export let showFeedModal;
	console.log(item);
</script>

<container>
	<ValueBlock bind:data={item} isItem={true} {feed} />
</container>

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Show Notes</button
	>

	<button
		on:click={() => {
			screenIndex++;
		}}>Chapters/Transcript</button
	>
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		height: calc(100% - 40px);
		overflow: auto;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}
</style>
