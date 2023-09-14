<script>
	export let feed;
	export let item;
	export let screenIndex;

	let warningMessage = ''; // Initialize as empty string

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
</script>

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

<style>
	/* Add your CSS here */
</style>
