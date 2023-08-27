<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let feed;
	export let item;
	export let screenIndex;

	console.log(item);
</script>

<h3>Podcast Info</h3>
<label>
	Podcast Title <input bind:value={feed.title} />
</label>

<label>
	Podcast Artwork <input bind:value={feed.image.url} />
</label>
<img src={feed?.image?.url} style="width:50px; height:50px" />
<textarea bind:value={feed.description} />

<ValueBlock bind:data={feed} />

<button on:click={() => screenIndex++}>Episode Info</button>
