<script>
	import { remoteServer } from '$/stores';
	export let block;
	let hasChanged = false;

	function fetchChapters() {
		console.log(block.chaptersUrl);
		if (block?.settings?.chaptersEnabled && block?.chaptersUrl) {
			fetch(remoteServer + '/api/proxy?url=' + block.chaptersUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not OK');
					}
					return response.json();
				})
				.then((data) => {
					console.log(data);
					block.chapters = data;
				})
				.catch((error) => {
					console.error('Error fetching chapter data:', error);
					block.chapters = undefined;
				});
		}
	}

	$: if (block?.settings?.chaptersEnabled && hasChanged) {
		fetchChapters();
		hasChanged = false;
	}
</script>

<label>
	<input
		type="checkbox"
		bind:checked={block.settings.chaptersEnabled}
		on:change={() => (hasChanged = true)}
	/>
	<h4>Use Chapters from Audio File</h4>
</label>

<style>
	label {
		color: var(--color-theme-blue);
		display: block;
		margin: 2px 0;
	}

	h4 {
		margin: 0;
		display: inline-block;
	}
</style>
