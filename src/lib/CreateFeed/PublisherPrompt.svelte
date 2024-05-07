<script>
	export let publisherFeedType = false;
</script>

<h2>What type of feed are you building?</h2>

<button-row>
	<button
		class="podcast"
		on:click={() => {
			publisherFeedType = 'podcast';
		}}
	>
		Podcast
	</button>
	<button
		class="publisher"
		on:click={() => {
			publisherFeedType = 'publisher';
		}}
	>
		Publisher
	</button>
</button-row>

<style>
	
button {
	width: 80px;
	margin: 0 8px;
}

.podcast {
	background-color: var(--color-theme-blue);
}

.publisher {
	background-color: var(--color-theme-purple);
}

</style>