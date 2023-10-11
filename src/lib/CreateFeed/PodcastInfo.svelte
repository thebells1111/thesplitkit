<script>
	import ValueBlock from './ValueBlock/ValueBlock.svelte';
	export let feed;
	export let item;
	export let screenIndex;

	console.log(item);
	console.log(feed);

	feed['itunes:author'] = feed['itunes:author'] || feed.author;
</script>

<container>
	<h2>Podcast Info</h2>

	<h3>Required</h3>
	<underline />
	<required>
		<label>
			Podcast Title <input bind:value={feed.title} placeholder="(required)" />
		</label>
		<image-container>
			<label>
				Link to Podcast Artwork <input bind:value={feed.image.url} placeholder="(required)" />
			</label>
			<img src={feed?.image?.url} style="width:50px; height:50px" />
		</image-container>
		<label>
			Link to Podcast Website <input bind:value={feed.link} placeholder="(required)" />
		</label>
		<explicit>
			<h4>Explicit Content</h4>
			<radio-buttons>
				<label>
					<input type="radio" bind:group={feed['itunes:explicit']} value="yes" />
					Yes
				</label>
				<label>
					<input type="radio" bind:group={feed['itunes:explicit']} value="no" />
					No
				</label>
			</radio-buttons>
		</explicit>
		<label>
			Podcast Description
			<textarea bind:value={feed.description} />
		</label>
	</required>

	<h3>Optional</h3>
	<underline />
	<optional>
		<label>
			Podcast Author <input bind:value={feed['itunes:author']} placeholder="(optional)" />
		</label>
		<label>
			Podcast Keywords <input bind:value={feed['itunes:keywords']} placeholder="(optional)" />
		</label>
	</optional>
</container>

<button-container>
	<button on:click={() => screenIndex++}>Podcast Value</button>
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
		justify-content: flex-end;
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

	textarea {
		height: 100px;
		resize: none;
		margin: 0 8px;
	}

	optional label {
		margin-bottom: 8px;
	}
</style>
