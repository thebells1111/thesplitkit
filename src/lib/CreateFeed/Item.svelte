<script>
	export let screenIndex;
	export let feed;
	export let item;

	let warningMessage = '';
	console.log(feed);

	async function handleImportAudio() {
		warningMessage = ''; // Clear warning

		const url = item.enclosure['@_url'];
		if (!url) return;

		try {
			const response = await fetch(url, { method: 'HEAD' });
			const contentType = response.headers.get('Content-Type');

			if (contentType && contentType.startsWith('audio/')) {
				item.enclosure['@_url'] = url;
				item.enclosure['@_length'] = response.headers.get('Content-Length') || '';
				item.enclosure['@_type'] = contentType;

				// Get audio duration
				const audio = new Audio(url);
				audio.addEventListener('loadedmetadata', function () {
					item.duration = audio.duration;
				});
				audio.load();
			} else {
				warningMessage = 'Not an audio file.';
			}
		} catch (error) {
			warningMessage = `An error occurred. <br/> <br/> This is usually because the file doesn't exist <br/> or Cross Origin Resource Sharing (CORS) <br/> is not enabled on your server.`;
			console.error('Fetch error:', error);
		}
	}
</script>

<h3>Episode Info</h3>
<label>
	Episode Title <input bind:value={item.title} />
</label>

<label>
	Link to Episode Artwork <input bind:value={item['itunes:image']['@_href']} />
</label>
<img src={item?.image?.url} style="width:50px; height:50px" />
<label>
	Link to Episode Audio File
	<input bind:value={item.enclosure['@_url']} />
</label>
<button on:click={handleImportAudio}> Import </button>
{#if warningMessage}
	<div class="warning">{@html warningMessage}</div>
{/if}
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
