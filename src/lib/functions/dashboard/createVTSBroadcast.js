import { remoteServer } from '$/stores';
import combineValues from './combineValues';

export default async function createVTSBroadcast(
	currentVTS,
	broadcastingBlock,
	fallbackBlock,
	episode
) {
	let splits = await handleSplit(currentVTS);
	let destinations = combineValues({
		defaultRemotePercent: fallbackBlock?.settings?.split || 95,
		activeValue: fallbackBlock?.value,
		splits
	});
	broadcastingBlock.value = broadcastingBlock.value || {};
	broadcastingBlock.value.destinations = destinations;

	return broadcastingBlock;

	async function handleSplit(split) {
		let podcastData = await fetch(
			remoteServer +
				`/api/queryindex?q=${encodeURIComponent(
					`/podcasts/byguid?guid=${broadcastingBlock.feedGuid}`
				)}`
		);
		let podcast = await podcastData.json();
		const baseValueBlock = episode?.value || (podcast.status === 'true' && podcast?.feed?.value);
		if (split?.remoteItem) {
			const feedGuid = split.remoteItem?.feedGuid;
			const itemGuid = split.remoteItem?.itemGuid;
			const feedGuidUrl =
				remoteServer +
				`/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${feedGuid}`)}`;
			const itemsUrl =
				remoteServer +
				`/api/queryindex?q=${encodeURIComponent(`/episodes/bypodcastguid?guid=${feedGuid}`)}`;

			let splitInfo = {};
			let valueBlock = { feed: null, item: null };

			const [feedData, itemsData] = await Promise.all([
				fetch(feedGuidUrl).then((res) => res.json()),
				fetch(itemsUrl).then((res) => res.json())
			]).catch((error) => {
				console.error('Error:', error);
			});

			let feed = feedData?.feed;
			valueBlock.feed = feed?.value;

			let items = itemsData?.items;
			let item = items?.find((v) => v.guid === itemGuid);
			valueBlock.item = item?.value;
			splitInfo.baseValue = baseValueBlock;
			splitInfo.remoteValue = valueBlock.item || valueBlock.feed;
			splitInfo.remotePercentage = Number(split.remotePercentage);
			return splitInfo;
		}
	}
}
