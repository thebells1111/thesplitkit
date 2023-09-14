<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let screenIndex;
	export let feed;
	export let item;
</script>

<ValueBlock bind:data={item} isItem={true} {feed} />

<button
	on:click={() => {
		screenIndex--;
	}}>Episode Info</button
>

<button
	on:click={() => {
		screenIndex++;
	}}>Chapters/Transcripts</button
>
