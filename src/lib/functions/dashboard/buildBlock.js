import addFeed from '../addFeed';

import { remoteServer } from '$/stores';

export default async function buildBlock(block, eventGuid) {
	console.log(block);
	let feedUrl = `${remoteServer}/api/queryindex?q=${encodeURIComponent(
		`/podcasts/byguid?guid=${block.feedGuid}`
	)}`;
	let episodeUrl = `${remoteServer}/api/queryindex?q=${encodeURIComponent(
		`episodes/byguid?guid=${block.itemGuid}&podcastguid=${block.feedGuid}&max=1000`
	)}`;

	let [feedRes, episodeRes] = await Promise.all([fetch(feedUrl), fetch(episodeUrl)]);

	let data = await feedRes.json();
	let feed = data?.feed;

	let episodeData = await episodeRes.json();
	let episode = episodeData?.episode;

	if (feed && episode) {
		return addFeed(episode, 'music', feed, eventGuid);
	}
}
