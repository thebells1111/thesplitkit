<script>
	export let feed;
	export let item;
	export let screenIndex;
	import { feedShowNotes } from '$/stores';

	let warningMessage = ''; // Initialize as empty string

	function isValidURL(str) {
		try {
			new URL(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	async function verifyFeed() {
		if (!feed.title) {
			warningMessage += 'You podcast needs a title/n';
		}
		if (!feed.description) {
			warningMessage += 'You podcast needs a description/n';
		}
		if (!feed?.image?.url) {
			warningMessage += 'You podcast needs an image/n';
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
		console.log(item);
		console.log($feedShowNotes);
	}
</script>

<button on:click={downloadFeed}>Download Feed</button>

<style>
	/* Add your CSS here */
</style>
