<script>
	import { v4 as uuidv4 } from 'uuid';

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
			warningMessage += 'Your podcast needs a title./n';
		}
		if (!feed?.image?.url) {
			warningMessage += 'Your podcast needs an image./n';
		}
		if (!feed?.link) {
			warningMessage += 'Your podcast needs a website link./n';
		}
		if (!feed?.description) {
			warningMessage += 'Your podcast needs a description./n';
		}
		if (!feed?.['itunes:explicit']) {
			warningMessage += 'Click Yes or No on Podcast Explicit Content/n';
		}
		if (!item.title) {
			warningMessage += 'Your episode needs a title./n';
		}
		if (!item?.enclosure?.['@_url']) {
			warningMessage += 'Your episode needs an audio file./n';
		}
		if (!item?.duration) {
			warningMessage += 'Click Get Audio Duration for your Episode./n';
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

	async function createFeed() {
		feed['podcast:guid'] = feed['podcast:guid'] || uuidv4();

		console.log(feed);
	}

	async function downloadFeed() {
		console.log(feed);
		console.log(item);
		createFeed();
	}
</script>

<button on:click={downloadFeed}>Download Feed</button>

<style>
	/* Add your CSS here */
</style>
