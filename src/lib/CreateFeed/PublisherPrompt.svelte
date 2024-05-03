<script>
	export let publisherFeedType = false;
</script>

<h2>What type of feed are you building?</h2>

<div>
	<button
		on:click={() => {
			publisherFeedType = 'podcast';
		}}>Podcast</button
	>
	<button
		on:click={() => {
			publisherFeedType = 'publisher';
		}}>Publisher</button
	>
</div>
