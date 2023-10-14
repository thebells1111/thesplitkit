<script>
	export let feed;
	export let item;
	export let showFeedModal;
	export let screenIndex;
	import DownloadFeed from './DownloadFeed.svelte';
	import ChaptersCreator from '$routes/(main)/chapters/[guid]/+page.svelte';

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
			warningMessage = `Invalid ${type.charAt(0).toUpperCase() + type.slice(1)} URL`;
			return;
		}

		try {
			const response = await fetch(url);
			if (!response.ok) {
				warningMessage = `No File is returned from the ${
					type.charAt(0).toUpperCase() + type.slice(1)
				} URL`;
				return;
			}
			const contentType = response.headers.get('Content-Type');

			if (type === 'chapters') {
				if (!contentType || !contentType.includes('application/json')) {
					warningMessage = "Improper Chapters File Type. Ensure it's a JSON file.";
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

<h2>Chapters & Transcripts</h2>
<container>
	<verify>
		<label>
			Link to Chapters File
			<input bind:value={item['podcast:chapters']['@_url']} />
		</label>
		<button on:click={verifyFile.bind(this, 'chapters')}>Verify</button>
	</verify>

	<verify>
		<label>
			Link to Transcript File
			<input bind:value={item['podcast:transcript']['@_url']} />
		</label>
		<button on:click={verifyFile.bind(this, 'transcript')}>Verify</button>
	</verify>

	<p class="warning">{@html warningMessage}</p>

	<chapters>
		<ChaptersCreator />
	</chapters>
</container>

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Episode Value</button
	>

	<button
		on:click={() => {
			screenIndex++;
		}}>Download Feed</button
	>
</button-container>

<style>
	h2 {
		margin: 0;
		color: var(--color-theme-2);
		text-align: center;
	}

	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
		overflow: auto;
	}

	chapters {
		flex: 1;
		position: relative;
		top: -16px;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}

	label {
		display: flex;
		flex-direction: column;
		font-weight: 600;
		margin: 6px 8px;
		color: var(--color-theme-2);
	}

	input {
		margin: 0 8px;
	}

	.warning {
		color: red;
		font-weight: bold;
		font-size: 0.9em;
		text-align: center;
		min-height: 32px;
		margin: 0px;
	}

	verify {
		display: flex;
	}

	verify label {
		flex: 1;
	}
	verify button {
		align-self: flex-end;
		margin: 0 16px 8px 0;
	}
</style>
