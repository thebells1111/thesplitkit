<script>
	export let screenIndex;
	export let feed;
	export let item;
	let showInput = false;
	let url = '';

	async function handleSubmit() {
		screenIndex = 1;
	}
</script>

<h3>Are you adding this event to an existing feed?</h3>
{#if showInput}
	<label>
		<p>Link to feed</p>
		<input bind:value={url} />
	</label>
	<button on:click={handleSubmit}>Get Feed</button>
{:else}
	<button-row>
		<button
			on:click={() => {
				showInput = true;
			}}>Yes</button
		>
		<button
			on:click={() => {
				screenIndex = 1;
			}}>No</button
		>
	</button-row>
{/if}
