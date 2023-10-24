<script>
	import { onMount } from 'svelte';
	import latestSongs from './latestSongs.json';
	import AddBlocksIcon from '$lib/icons/AddBlocks.svelte';
	import PlayIcon from '$lib/icons/PlayArrow.svelte';
	import PauseIcon from '$lib/icons/Pause.svelte';
	import DownloadIcon from '$lib/icons/Download.svelte';
	import { tick } from 'svelte';

	import { remoteServer } from '$/stores';

	export let addFeed = () => {};
	let rippleAlbum = false;
	let loading = true;

	setTimeout(() => {
		loading = false;
	}, 1000);

	async function shimmerCard(index) {
		latestSongs[index].shimmer = true;
		setTimeout(() => {
			latestSongs[index].shimmer = false;
		}, 200);
	}
	let player;
	let isPaused = true;

	onMount(() => {
		player.onpause = function () {
			isPaused = true;
		};
		player.onplay = function () {
			isPaused = false;
		};
		// player.muted = true;
	});

	function downloadSong(audioSrc) {
		if (audioSrc) {
			const extension = audioSrc.split('.').pop();
			downloadFile(audioSrc, `song.${extension}`);
		}
	}

	function downloadFile(url, filename) {
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;
		anchor.target = '_blank'; // Open in new tabs
		anchor.click();
	}

	async function fetchEpisode(episode) {
		let feedUrl = `${remoteServer}/api/queryindex?q=${encodeURIComponent(
			`/podcasts/byguid?guid=${episode.podcastGuid}`
		)}`;
		let episodesUrl = `${remoteServer}/api/queryindex?q=${encodeURIComponent(
			`/episodes/bypodcastguid?guid=${episode.podcastGuid}`
		)}`;

		let [feedRes, episodesRes] = await Promise.all([fetch(feedUrl), fetch(episodesUrl)]);

		let data = await feedRes.json();
		let feed = data.feed;

		let episodesData = await episodesRes.json();
		let episodesResults = episodesData.items || [];

		feed.episodes = episodesResults;
		let foundEpisode = episodesResults.find((v) => v.guid === episode.guid);

		addFeed(foundEpisode, 'music', feed);
	}
</script>

<song-select>
	<album-card>
		<button-ripple>
			<expanding-circle class:ripple={rippleAlbum} />
		</button-ripple>

		<h2>New Releases</h2>
		<audio controls bind:this={player} autoplay />
	</album-card>
	{#if latestSongs.length}
		<h3>Songs</h3>
		{#if loading}
			<h1>Loading Songs</h1>
		{:else}
			<ul>
				{#each latestSongs as episode, index}
					<li>
						<card
							class={`songs ${episode.shimmer ? 'shimmer' : ''}`}
							class:active={player?.src === episode.enclosureUrl}
						>
							<button
								on:click={() => {
									if (player.src === episode.enclosureUrl) {
										if (isPaused) {
											player.play();
										} else {
											player.pause();
										}
									} else {
										player.src = episode.enclosureUrl;
									}
								}}
							>
								{#if player?.src === episode?.enclosureUrl}
									{#if isPaused}
										<PlayIcon size="27" />
									{:else}
										<PauseIcon size="27" />
									{/if}
								{:else}
									<PlayIcon size="27" />
								{/if}
							</button>
							<button on:click={downloadSong.bind(this, episode?.enclosureUrl)} class="download">
								<DownloadIcon size="27" />
							</button>
							<song-info>
								<img src={episode?.albumArt} alt={episode?.title} width="40" height="40" />
								<p>
									{`${episode?.title}${episode.artist ? ` - ${episode.artist}` : ''}`}
									{#if episode.artist}
										<br />Released {new Date(episode.datePublished * 1000).toLocaleDateString()}
									{/if}
								</p>
							</song-info>
							<button
								on:click={() => {
									shimmerCard(index);
									tick();
									console.log(episode);
									fetchEpisode(episode);
								}}
								class="add-icon"
							>
								<AddBlocksIcon size="24" />
							</button>
						</card>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</song-select>

<style>
	song-select {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		overflow: auto;
		margin-top: 8px;
		padding: 0 16px;
		overflow: hidden;
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
		display: flex;
		justify-content: center;
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
		max-width: 720px;
		margin: 4px 8px;
	}

	card.songs {
		justify-content: space-between;
	}

	song-info {
		flex: 1;
		display: flex;
		align-items: center;
		margin: 0 8px;
	}

	img {
		border: 1px solid gray;
		margin-right: 0.5em;
	}
	h3 {
		margin: 0;
	}

	button {
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

	button.add-icon {
		color: var(--color-text-1);
		background-color: rgb(0, 132, 180);

		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	button.download {
		background-color: var(--color-theme-purple);
		color: var(--color-text-purple);
	}
	album-card {
		display: flex;
		flex-direction: column;
		position: relative;
		align-items: center;
		margin-bottom: 12px;
		width: calc(100% - 16px);
	}

	audio {
		width: 100%;
	}

	album-card img {
		border-radius: 8px;
		width: 150px;
		height: 1;
	}

	album-card h2,
	album-card h3 {
		margin: 0;
		text-align: center;
		margin-bottom: 4px;
	}

	album-card button {
		position: absolute;
		right: calc(50% - 88px);
		top: 112px;
	}

	.shimmer {
		position: relative;
		overflow: hidden;
		background: linear-gradient(to right, hsl(38, 100%, 93%), hsl(38, 75%, 61%));
	}

	button-ripple {
		width: 150px;
		height: 150px;
		display: block;
		position: absolute;
		left: calc(50% - 78px);
		overflow: hidden;
	}

	expanding-circle {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		left: 126px;
		top: 125px;
	}

	expanding-circle.ripple {
		position: absolute;
		width: 520px;
		height: 520px;
		border-radius: 50%;
		left: -110px;
		top: -110px;
		transition: 0.3s;
		background: radial-gradient(circle, rgba(255, 242, 219, 0) 38%, rgba(255, 255, 255, 1) 94%);
	}

	.active {
		background-color: antiquewhite;
	}
</style>
