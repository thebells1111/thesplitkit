<script>
	import { remoteServer } from '$/stores';
	let chaptersEnabled = false;
	let clipsEnabled = false;
	export let block;

	function fetchChapters() {
		console.log(block);
		if (clipsEnabled && chaptersEnabled && block?.chaptersUrl) {
			fetch(remoteServer + '/api/proxy?url=' + block.chaptersUrl)
				.then((response) => {
					if (!response.ok) {
						throw new Error('Network response was not OK');
					}
					return response.json();
				})
				.then((data) => {
					block.chapters = data;
					console.log(data);
				})
				.catch((error) => {
					console.error('Error fetching chapter data:', error);
					block.chapters = undefined;
				});
		}
	}
</script>

{#if block?.chaptersUrl}
	<label>
		Enable Clipping
		<input type="checkbox" bind:value={clipsEnabled} on:change={fetchChapters} />
	</label>
	<label>
		Enable Chapters from Clip
		<input type="checkbox" bind:value={chaptersEnabled} on:change={fetchChapters} />
	</label>
{/if}
