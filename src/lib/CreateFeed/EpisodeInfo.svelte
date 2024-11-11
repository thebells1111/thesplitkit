<script>
	import { remoteServer, mainSettings } from '$/stores';
	import Spinner from '$lib/loaders/Spinner.svelte';

	export let screenIndex;
	export let feed;
	export let item;
	export let showFeedModal;
	console.log(item);

	let showLoading = false;

	let warningMessage = '';

	async function handleImportAudio() {
		showLoading = true;
		warningMessage = ''; // Clear warning

		const url = item.enclosure['@_url'];
		if (!url) return;

		try {
			const audio = new Audio(url);
			audio.addEventListener('loadedmetadata', function () {
				item.duration = formatDuration(audio.duration);
			});
			audio.load();
			const res = await fetch('/api/enclosurelength?q=' + encodeURIComponent(url));
			const data = await res.json();
			item.enclosure['@_url'] = data.url;
			item.enclosure['@_length'] = Number(data.length) || 0;
			item.enclosure['@_type'] = data.type;
			if (data.error) {
				throw new Error(data.error);
			}
		} catch (error) {
			warningMessage = `An error occurred. <br/> <br/> This is usually because the file doesn't exist <br/> or Cross Origin Resource Sharing (CORS) <br/> is not enabled on your server.`;
			console.error('Fetch error:', error);
		}
		showLoading = false;
	}

	function formatDuration(seconds) {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = Math.floor(seconds % 60);

		let durationStr = '';

		if (hrs > 0) {
			durationStr += `${hrs.toString().padStart(2, '0')}:`;
		}

		if (mins > 0 || hrs > 0) {
			durationStr += `${mins.toString().padStart(2, '0')}:`;
		}

		durationStr += `${secs.toString().padStart(2, '0')}`;

		return durationStr;
	}
</script>

<container>
	<h2>Episode Info</h2>
	<h3>Required</h3>
	<required>
		<underline />
		<label>
			Episode Title <input bind:value={item.title} placeholder="(required)" />
		</label>

		<label>
			Link to Episode Audio File
			<input bind:value={item.enclosure['@_url']} placeholder="(required)" />
		</label>

		<verify>
			<label>
				Duration
				<input
					bind:value={item.duration}
					readonly
					placeholder="enter Link to Episode Audio File, then click Get Audio Duration"
				/>
			</label>
			<button on:click={handleImportAudio}>Get Audio Duration</button>
		</verify>
	</required>

	<h3>Optional</h3>
	<underline />
	<optional>
		<image-container>
			<label>
				Link to Episode Artwork
				<input bind:value={item['itunes:image']['@_href']} placeholder="(optional)" />
			</label>
			{#if !$mainSettings?.lowBandwidth}
				<img src={item?.image?.url} style="width:50px; height:50px" />
			{/if}
		</image-container>
		<explicit>
			<h4>Explicit Content</h4>
			<radio-buttons>
				<label>
					<input type="radio" bind:group={item['itunes:explicit']} value="yes" />
					Yes
				</label>
				<label>
					<input type="radio" bind:group={item['itunes:explicit']} value="no" />
					No
				</label>
			</radio-buttons>
		</explicit>
	</optional>

	{#if warningMessage}
		<div class="warning">{@html warningMessage}</div>
	{/if}
</container>

{#if showLoading}
	<loader>
		<Spinner color="var(--color-theme-purple)" />
		<h1>Determining Duration</h1>
	</loader>
{/if}

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Podcast Value</button
	>

	<button
		on:click={() => {
			screenIndex++;
		}}>Show Notes</button
	>
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
		overflow: auto;
	}

	underline {
		display: block;
		width: 100%;
		border-bottom: 1px solid black;
		margin-bottom: 8px;
	}

	.warning {
		color: red;
		font-weight: bold;
		font-size: 0.9em;
		text-align: center;
		min-height: 32px;
	}

	label {
		display: flex;
		flex-direction: column;
		font-weight: 600;
		margin: 4px 8px;
		color: var(--color-theme-2);
	}

	input {
		margin: 0 8px;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}

	image-container {
		display: flex;
	}

	image-container img {
		margin-right: 16px;
	}

	image-container label {
		flex: 1;
		margin-right: 0px;
	}

	h2,
	h3,
	h4 {
		margin: 0;
		color: var(--color-theme-2);
	}
	h2 {
		text-align: center;
	}
	h3 {
		margin-top: 8px;
	}

	explicit {
		display: flex;
		flex-direction: column;
		margin-top: 8px;
	}

	explicit h4 {
		margin-left: 8px;
	}

	explicit label {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		margin: 4px 16px;
	}

	explicit label input {
		margin: 0 4px 2px 0;
	}

	radio-buttons {
		display: flex;
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

	optional label {
		margin-bottom: 8px;
	}

	loader {
		display: flex;
		flex-direction: column;
		position: fixed;
		height: 100vh;
		width: 100vw;
		align-items: center;
		justify-content: center;
		bottom: 50px;
		filter: drop-shadow(2px 2px 4px #000000);
		backdrop-filter: blur(5px);
	}

	loader h1 {
		position: relative;
		bottom: 80px;
		margin: 0;
		color: var(--color-theme-purple);
	}
</style>
