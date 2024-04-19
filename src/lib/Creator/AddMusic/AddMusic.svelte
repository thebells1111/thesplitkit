<script>
	import { remoteServer } from '$/stores';
	import { onMount } from 'svelte';
	import clone from 'just-clone';
	import Modal from '$lib/Modal/Modal.svelte';
	import SongSelect from './SongSelect.svelte';
	import LatestSongs from './LatestSongs.svelte';
	export let addFeed = () => {};
	let selectedFeed = {};
	let podcastIndexSearchResults = [];
	let episodes = [];
	let showSongs = false;
	let showLatest = false;
	// import archivedFeeds from './archivedFeeds.json';

	let searchQuery = '';
	let filteredResults = [];

	onMount(fetchAlbums);

	async function fetchAlbums() {
		const res = await fetch(
			remoteServer +
				`/api/queryindex?q=${encodeURIComponent(
					'podcasts/bymedium?medium=music&val=lightning&max=2750'
				)}`
		);
		let data = await res.json();
		console.log(data);

		// let data = { feeds: archivedFeeds };

		try {
			episodes = [];

			podcastIndexSearchResults = sortByPubDate(data.feeds).filter((v) => {
				let addFeed = true;
				if (
					//this removes 100% Retro Live Feed
					[5718023].find((w) => v.id === w) ||
					v.author === 'Gabe Barrett' ||
					[6612768].find((w) => v.id === w)
				) {
					addFeed = false;
				}
				return addFeed;
			});
			filteredResults = podcastIndexSearchResults;
		} catch (error) {}
	}

	function sortArrayAlphabetically(arr) {
		const articles = ['a', 'an', 'the'];

		arr.sort((a, b) => {
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();
			const wordA = titleA.split(' ')[0];
			const wordB = titleB.split(' ')[0];

			// If either word is an article, ignore it
			const indexA = articles.includes(wordA) ? 1 : 0;
			const indexB = articles.includes(wordB) ? 1 : 0;

			// Compare the remaining words
			const remainingA = titleA.split(' ').slice(indexA).join(' ');
			const remainingB = titleB.split(' ').slice(indexB).join(' ');

			if (remainingA < remainingB) {
				return -1;
			}
			if (remainingA > remainingB) {
				return 1;
			}
			return 0;
		});
		return arr;
	}

	function sortByPubDate(arr) {
		console.log(arr);
		arr.sort((a, b) => (a.newestItemPubdate < b.newestItemPubdate ? 1 : -1));
		console.log(arr);
		return arr;
	}

	async function searchPI() {
		console.log(searchQuery);
		if (searchQuery) {
			const res = await fetch(
				remoteServer +
					`/api/queryindex?q=/search/music/byterm` +
					encodeURIComponent(`?q=${searchQuery}`)
			);
			let data = await res.json();
			if (data.status) {
				return data.feeds;
			}
			return;
		}
		return podcastIndexSearchResults;
	}

	$: filterSearch(searchQuery);

	async function filterSearch() {
		if (searchQuery) {
			filteredResults = (await searchPI()) || [];
		} else {
			filteredResults = podcastIndexSearchResults;
		}
	}

	async function fetchEpisodes(guid, index, feed) {
		console.log(feed);
		showSongs = true;
		let feedUrl =
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
		let episodesUrl =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}`)}`;

		// let feedUrl =
		// 	remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byfeedid?id=${feed.id}`)}`;
		// let episodesUrl =
		// 	remoteServer + `/api/queryindex?q=${encodeURIComponent(`/episodes/byfeedid?id=${feed.id}`)}`;

		let res = await fetch(feedUrl);
		let data = await res.json();
		console.log(data);
		Promise.all([fetch(feedUrl), fetch(episodesUrl)])
			.then(async ([feedRes, episodesRes]) => {
				let data = await feedRes.json();
				console.log(data);
				let feed = data.feed;

				let episodesData = await episodesRes.json();
				let episodesResults = [].concat(episodesData.items);

				feed.episodes = episodesResults;

				episodes = feed.episodes || [];
				selectedFeed = feed;

				console.log(episodes);
			})
			.catch((err) => {
				console.error('Error fetching episodes:', err);
			});
	}
</script>

<albums>
	<albums-top>
		<input bind:value={searchQuery} placeholder="filter albums" />
		<fade-top />
	</albums-top>
	<ul>
		<!-- <li class="albums">
			<card
				on:click={() => {
					showLatest = true;
				}}
			>
				<img src="/splitkit64.png" width="40" height="40" />
				<h3>Latest Releases</h3>
				<div style={'width: 40px;'} />
			</card>
		</li> -->
		{#if podcastIndexSearchResults.length}
			{#each filteredResults as feed, index}
				<li class="albums">
					<card on:click={fetchEpisodes.bind(this, feed?.podcastGuid, index, feed)}>
						<img src={feed?.artwork || feed?.image} alt={feed?.title} width="60" height="60" />
						<div>
							<h3>{feed?.title}</h3>
							<p>{feed?.author}</p>

							<p>
								{feed?.newestItemPubdate
									? 'Latest release: ' +
									  new Date(feed?.newestItemPubdate * 1000).toLocaleDateString()
									: ''}
							</p>
						</div>
						<div style={'width: 40px;'} />
					</card>
				</li>
			{/each}
		{:else}
			<h2>Loading Songs</h2>
		{/if}
	</ul>
</albums>

<Modal bind:showModal={showSongs}>
	<SongSelect {addFeed} {episodes} feed={selectedFeed} />
</Modal>

<Modal bind:showModal={showLatest}>
	<LatestSongs {addFeed} />
</Modal>

<style>
	albums {
		display: flex;
		flex-direction: column;
		height: calc(100%);
		overflow: hidden;
		width: calc(100% - 16px);
	}

	albums-top {
		display: block;
		width: calc(100% - 16px);
		position: relative;
		margin: 0 8px;
	}

	input {
		margin: 8px 0;
		padding: 4px;
		width: calc(100% - 12px);
		border-radius: 4px;
		border: 1px solid gray;
		font-size: 1.1em;
	}

	fade-top {
		display: block;
		height: 20px;
		width: 100%;
		background: linear-gradient(to top, transparent, white);
		position: absolute;
		bottom: -20px;
	}
	ul {
		padding: 20px 0;
		margin: 0 8px;
		width: calc(100% - 16px);
		overflow: auto;
	}

	li {
		list-style: none;
		padding: 0;
		width: 100%;
	}
	h2 {
		text-align: center;
	}

	h3 {
		margin: 0;
	}
	p {
		margin: 0;
	}

	card {
		display: flex;
		align-items: center;
		padding: 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		width: calc(100% - 24px);
		margin: 4px 8px;
	}

	img {
		border: 1px solid gray;
		margin-right: 0.5em;
		border-radius: 4px;
	}
	h3 {
		margin: 0;
	}

	@media (max-width: 799px) {
	}
</style>
