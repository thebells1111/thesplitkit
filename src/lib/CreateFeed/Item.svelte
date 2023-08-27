<script>
	export let screenIndex;
	export let feed;
	export let item;
</script>

<h3>Episode Info</h3>
<label>
	Episode Title <input bind:value={item.title} />
</label>

<label>
	Link to Episode Artwork <input bind:value={item.image.url} />
</label>
<img src={item?.image?.url} style="width:50px; height:50px" />
<label>
	Link to Episode Audio File
	<input bind:value={item.enclosure} />
</label>
<label>
	Show Notes
	<textarea bind:value={item.description} />
</label>

<button
	on:click={() => {
		screenIndex--;
	}}>Podcast Info</button
>

<button
	on:click={() => {
		screenIndex++;
	}}>Episode Value</button
>
