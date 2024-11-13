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

<div>
	<label>
		<input
			type="checkbox"
			bind:checked={block.settings.chaptersEnabled}
			on:change={() => (hasChanged = true)}
		/>
		<h3>Use Chapters from Audio File</h3>
	</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		margin: 8px 0;
	}

	label {
		color: var(--color-theme-blue);
		margin-bottom: 8px;
	}

	h3 {
		margin: 0;
		display: inline-block;
	}
</style>
