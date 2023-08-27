<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let screenIndex;
	export let feed;
	export let item;
</script>

<ValueBlock bind:data={item} />

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
