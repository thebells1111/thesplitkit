<script>
	export let feed;
	export let item;
	export let screenIndex;
	import DownloadFeed from './DownloadFeed.svelte';

	let warningMessage = ''; // Initialize as empty string

	console.log(item);

	function isValidURL(str) {
		try {
			new URL(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	async function verifyFile(type) {
		let url = item[`podcast:${type}`]['@_url'];
		warningMessage = '';

		if (!isValidURL(url)) {
			warningMessage = 'Invalid URL';
			return;
		}

		try {
			const response = await fetch(url);
			if (!response.ok) {
				warningMessage = 'No File is returned from that URL';
				return;
			}
			const contentType = response.headers.get('Content-Type');

			if (type === 'chapters') {
				if (!contentType || !contentType.includes('application/json')) {
					warningMessage = "Improper Chapter File Type. Ensure it's a JSON file.";
				}
			} else if (type === 'transcript') {
				if (
					!contentType ||
					(!contentType.includes('application/x-subrip') &&
						!contentType.includes('application/srt'))
				) {
					warningMessage = "Improper Transcript File Type. Ensure it's an SRT file.";
				}
			}
		} catch (error) {
			warningMessage = `An error occurred. <br/> <br/> This is usually because the file doesn't exist <br/> or Cross Origin Resource Sharing (CORS) <br/> is not enabled on your server.`;
		}
	}

	async function downloadFeed() {
		console.log(feed);
	}
</script>

<container>
	<label>
		Link to Chapter File
		<input bind:value={item['podcast:chapters']['@_url']} />
	</label>
	<button on:click={verifyFile.bind(this, 'chapters')}>Verify</button>

	<label>
		Link to Transcript File
		<input bind:value={item['podcast:transcript']['@_url']} />
	</label>
	<button on:click={verifyFile.bind(this, 'transcript')}>Verify</button>

	<p>{@html warningMessage}</p>
</container>

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Episode Value</button
	>

	<DownloadFeed bind:screenIndex bind:feed bind:item />
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}
</style>
