<script>
	import { remoteServer, mainSettings, cachedAlbums } from '$/stores';
	import { onMount } from 'svelte';
	import VirtualList from 'svelte-tiny-virtual-list';
	import Modal from '$lib/Modal/Modal.svelte';
	import SongSelect from './SongSelect.svelte';
	export let addFeed = () => {};
	let selectedFeed = {};
	let podcastIndexSearchResults = [];
	let episodes = [];
	let showSongs = false;
	let searchQuery = '';
	let filteredResults = [];
	let cacheText = '-Results are cached. Click here to fetch latest albums.-';

	onMount(fetchAlbums);

	async function fetchAlbums(refresh) {
		if (!$cachedAlbums || refresh) {
			cacheText = '-Fetching Albums-';
			const res = await fetch(
				remoteServer +
					`/api/queryindex?q=${encodeURIComponent(
						'podcasts/bymedium?medium=music&val=lightning&max=10000'
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
				$cachedAlbums = podcastIndexSearchResults;
				cacheText = '-Results are cached. Click here to fetch latest albums.-';
			} catch (error) {}
		} else {
			episodes = [];
			podcastIndexSearchResults = $cachedAlbums;
			filteredResults = podcastIndexSearchResults;
		}
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

		return podcastIndexSearchResults.filter(
			(v) =>
				v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				v.author.toLowerCase().includes(searchQuery.toLowerCase())
		);
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
		if (!feed.episodes) {
			console.log(feed);
			showSongs = true;
			let feedUrl =
				remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
			let episodesUrl =
				remoteServer +
				`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}&max=1000`)}`;

			let res = await fetch(feedUrl);
			let data = await res.json();
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

					$cachedAlbums.find((v) => v.podcastGuid === feed.podcastGuid).episodes = episodes;
					// $cachedAlbums.find((v) => v.podcastGuid === feed.podcastGuid).episodes = episodes;
				})
				.catch((err) => {
					console.error('Error fetching episodes:', err);
				});
		} else {
			showSongs = true;
			selectedFeed = $cachedAlbums.find((v) => v.podcastGuid === feed.podcastGuid);
			episodes = selectedFeed.episodes;
			console.log(episodes);
		}
	}

	let listHeight = 500;
	let headerHeight = 16;
	let sectionHeight;
	let sectionWidth;
	let virtualList;
	let scrollToIndex = 0;
	$: if (sectionHeight && headerHeight) {
		listHeight = sectionHeight - headerHeight;
	}
</script>

<albums>
	<albums-top>
		<input bind:value={searchQuery} placeholder="filter albums" />
		{#if $cachedAlbums}
			<p on:click={fetchAlbums.bind(this, true)}>
				{cacheText}
			</p>
		{/if}
	</albums-top>
	<section bind:clientHeight={sectionHeight} bind:clientWidth={sectionWidth}>
		{#if podcastIndexSearchResults.length}
			{#if filteredResults.length}
				<VirtualList
					bind:this={virtualList}
					bind:height={listHeight}
					width="100%"
					{scrollToIndex}
					itemCount={filteredResults.length}
					itemSize={filteredResults.map((v) => {
						let charPerRow = Math.floor((sectionWidth - 86) / 14);
						let rows = Math.ceil((v?.title.length || 0) / charPerRow) + 1;
						let titleHeight = 25 * rows;
						return titleHeight + 32;
					})}
					overscanCount={5}
				>
					<div slot="item" let:index let:style {style} class="row">
						<div class="albums">
							<card
								on:click={fetchEpisodes.bind(
									this,
									filteredResults[index]?.podcastGuid,
									index,
									filteredResults[index]
								)}
							>
								{#if !$mainSettings?.lowBandwidth?.images}
									<img
										src={filteredResults[index]?.artwork || filteredResults[index]?.image}
										alt={filteredResults[index]?.title}
										width="60"
										height="60"
									/>
								{/if}
								<div>
									<h3>{filteredResults[index]?.title}</h3>
									<p>{filteredResults[index]?.author}</p>

									<p>
										{filteredResults[index]?.newestItemPubdate
											? 'Latest release: ' +
											  new Date(
													filteredResults[index]?.newestItemPubdate * 1000
											  ).toLocaleDateString()
											: ''}
									</p>
								</div>
								<div style={'width: 40px;'} />
							</card>
						</div>
					</div>
				</VirtualList>
			{/if}
		{:else}
			<h2>Loading Songs</h2>
		{/if}
	</section>
</albums>

{#if showSongs}
	<Modal bind:showModal={showSongs}>
		<SongSelect {addFeed} {episodes} feed={selectedFeed} />
	</Modal>
{/if}

<style>
	albums {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		width: calc(100%);
		height: calc(100% - 42px);
	}

	albums-top {
		display: block;
		width: calc(100% - 16px);
		position: relative;
		margin: 0 8px;
		height: 72px;
	}

	input {
		margin: 8px 0;
		padding: 4px;
		width: calc(100% - 12px);
		border-radius: 4px;
		border: 1px solid gray;
		font-size: 1.1em;
	}

	albums-top > p {
		text-align: center;
		cursor: pointer;
	}

	section {
		padding: 0;
		margin: 0 8px;
		width: calc(100% - 8px);
		height: calc(100% - 72px);
		overflow: auto;
		position: relative;
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
