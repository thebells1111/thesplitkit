import processLiveItems from './processLiveItems';
import removeAtSign from './removeAtSign';
import { remoteServer } from '$/stores';
import fetchRSS from './fetchRSS.js';

async function fetchFeed({ url, guid }) {
	let feedUrl;
	let episodesUrl;
	console.log(url);

	if (url) {
		feedUrl =
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byfeedurl?url=${url}`)}`;

		episodesUrl =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`/episodes/byfeedurl?url=${url}&max=1000`)}`;
	}

	if (guid) {
		feedUrl =
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
		episodesUrl =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${guid}&max=1000`)}`;
	}

	return Promise.all([fetch(feedUrl), fetch(episodesUrl)])
		.then(async ([feedRes, episodesRes]) => {
			let data = await feedRes.json();
			let feed = data.feed;
			console.log(feed);
			let liveItems;
			let channel = await fetchRSS(feed.url);
			console.log(channel);
			if (channel?.['podcast:liveitem']) {
				liveItems = processLiveItems(channel?.['podcast:liveitem']);
			}

			let remoteItems;

			if (channel?.['podcast:remoteItem']) {
				remoteItems = [].concat(channel?.['podcast:remoteItem']);
			}

			let episodesData = await episodesRes.json();
			let episodes = [].concat(
				liveItems ? liveItems : [],
				episodesData.items ? episodesData.items : []
			);

			feed.episodes = episodes;
			if (remoteItems) {
				feed.remoteItems = removeAtSign(remoteItems);
			}
			console.log(feed);

			return feed;
		})
		.catch((err) => {
			console.error('Error fetching episodes:', err);
		});
}

export default fetchFeed;
