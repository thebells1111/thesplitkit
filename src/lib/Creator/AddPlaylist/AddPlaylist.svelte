<script>
	import { page } from '$app/stores';

	import fetchFeed from '$functions/fetchFeed.js';
	import buildBlock from '$functions/dashboard/buildBlock.js';
	let value = '';
	let eventGuid = $page.params.guid;
	let processingIndex = 0;
	let playlistLength;

	async function handlFetchFeed() {
		processingIndex = 0;
		let validated = parseInput(value);
		if (validated) {
			let feed = await fetchFeed(validated);
			let remoteItems;
			if (feed?.remoteItems) {
				remoteItems = [].concat(feed.remoteItems);
				playlistLength = remoteItems.length;
				for (const [index, v] of remoteItems.entries()) {
					processingIndex = index;
					let block = { feedGuid: v.feedGuid, itemGuid: v.itemGuid, index };
					await buildBlock(block, eventGuid);
				}
			} else {
				alert(`This feed isn't a playlist`);
			}
		} else {
			alert("This isn't a valid input. Input a playlist guid, LN Beats link, or feed url");
		}
	}

	function parseInput(input) {
		const guidRegex =
			/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		const urlRegex = /^(https?:\/\/[^\s]+)/;
		const lnbeatsPrefix = 'https://lnbeats.com/album/';

		if (guidRegex.test(input)) {
			return { guid: input };
		}

		const urlMatch = input.match(urlRegex);
		if (urlMatch) {
			return input.startsWith(lnbeatsPrefix)
				? { guid: input.replace(lnbeatsPrefix, '') }
				: { url: input };
		}

		return null;
	}
</script>

{processingIndex}
{#if processingIndex}
	<h2>Processing {processingIndex} of {playlistLength}</h2>
{:else}
	<input bind:value placeholder="playlist guid, LN Beats link, or feed url" />
	<button on:click={handlFetchFeed}>Import Playlist</button>
{/if}
