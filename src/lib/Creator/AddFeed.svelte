<script>
	import { XMLParser } from 'fast-xml-parser';

	import { remoteServer, mainSettings, changeDefault, liveBlocks } from '$/stores';
	import AddBlocksIcon from '$lib/icons/AddBlocks.svelte';
	import fetchFeed from '$functions/fetchFeed.js';
	export let addFeed = () => {};
	let selectedFeed = {};
	let selectedEpisode = {};
	let showEpisode = false;
	let podcastIndexSearchResults = [];
	let episodeResults = [];

	let indexQuery = '';
	// indexQuery = 'podcasting 2.0';

	async function searchPodcastIndex() {
		selectedFeed = {};
		selectedEpisode = {};
		let url =
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/search/byterm?q=${indexQuery}`)}`;

		const res = await fetch(url);
		let data = await res.json();

		try {
			console.log(data);
			episodeResults = [];

			podcastIndexSearchResults = data.feeds || [];
			console.log(podcastIndexSearchResults);
		} catch (error) {}
	}

	async function fetchEpisodes(guid) {
		fetchFeed({ guid }).then((feed) => {
			episodeResults = feed.episodes || [];
			selectedFeed = feed;
		});
	}

	function handleEnter(event) {
		if (event.key === 'Enter') {
			searchPodcastIndex(indexQuery);
		}
	}

	$: if ($changeDefault && $liveBlocks?.[0]?.feedGuid) {
		fetchEpisodes($liveBlocks[0].feedGuid);
	}
</script>

<fetch-feed>
	<mobile-top>
		<input bind:value={indexQuery} on:keydown={handleEnter} placeholder="search for podcast" />
	</mobile-top>
	<button class="search" on:click={searchPodcastIndex}>Search Directory</button>
</fetch-feed>

{#if podcastIndexSearchResults.length && !episodeResults.length}
	<ul>
		{#each podcastIndexSearchResults as feed}
			<li class="pi-result" on:click={fetchEpisodes.bind(this, feed?.podcastGuid)}>
				<card>
					{#if !$mainSettings?.lowBandwidth?.images}
						<img src={feed?.artwork || feed?.image} alt={feed?.title} width="40" height="40" />
					{/if}
					{feed?.title}
				</card>
			</li>
		{/each}
	</ul>
{/if}

{#if selectedFeed.title}
	<feed-header>
		<h3>Podcast</h3>
	</feed-header>
	<selected-feed>
		<feed-info>
			{#if !$mainSettings?.lowBandwidth?.images}
				<img
					src={selectedFeed?.artwork || selectedFeed?.image}
					alt={selectedFeed?.title}
					width="40"
					height="40"
				/>
			{/if}
			<p>{selectedFeed.title}</p>
			<button on:click={addFeed.bind(this, selectedFeed, 'podcast')} class="add-icon">
				<AddBlocksIcon size="24" />
			</button>
		</feed-info>
	</selected-feed>
{/if}

{#if episodeResults.length}
	<h3>Episodes</h3>
	<ul>
		{#each episodeResults as episode}
			<li class="pi-result">
				<card>
					{#if !$mainSettings?.lowBandwidth?.images}
						<img
							src={episode?.artwork ||
								episode?.image ||
								selectedFeed?.artwork ||
								selectedFeed?.image}
							alt={episode?.title}
							width="40"
							height="40"
						/>
					{/if}
					<p>{episode?.title}</p>
					<button on:click={addFeed.bind(this, episode, 'podcast', selectedFeed)} class="add-icon">
						<AddBlocksIcon size="24" />
					</button>
				</card>
			</li>
		{/each}
	</ul>
{/if}

<style>
	fetch-feed {
		display: flex;
		align-items: center;
		justify-content: center;
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	mobile-top {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		min-height: 58px;
	}

	input {
		margin-left: 8px;
		width: 100%;
	}

	ul {
		padding: 0;
		flex: 1;
		overflow: auto;
		margin: 0 8px;
		width: calc(100% - 16px);
	}

	li {
		list-style: none;
		padding: 0;
		width: 100%;
	}

	.pi-result {
		display: flex;
		align-items: center;
	}

	card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		width: 100%;
		margin: 4px 8px;
	}

	img {
		border: 1px solid gray;
		margin-right: 0.5em;
	}
	h3 {
		margin: 0;
	}

	feed-header {
		display: flex;
		margin: 8px 0 4px 8px;
		align-items: flex-end;
	}

	selected-feed {
		display: flex;
		margin: 0 8px 16px 8px;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 16px);
	}

	feed-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		width: calc(100% - 16px);
		margin: 4px 8px;
		background-color: hsl(38, 100%, 93%);
	}

	feed-info p {
		margin: 0;
	}

	.search {
		margin-bottom: 8px;
	}

	button.add-icon {
		color: var(--color-text-0);
		background-color: hsl(38, 100%, 61%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	@media (max-width: 799px) {
		fetch-feed {
			width: 100%;
			flex-direction: column;
			margin: 0;
		}

		mobile-top {
			width: calc(100% - 16px);
			min-height: 58px;
		}
		fetch-feed button {
			margin-top: 8px;
			width: 75%;
		}

		selected-feed {
			flex-direction: column;
		}
	}
</style>
