import { remoteServer } from '$/stores';
import combineValues from './combineValues';

export default async function getNextVTS(VTS, VTSIndex, activeBlock, episode) {
	if (VTSIndex > -1) {
		let splits = await handleSplit(VTS[VTSIndex]);
		let destinations = combineValues({
			defaultRemotePercent: activeBlock?.settings?.split || 95,
			activeValue: activeBlock?.value,
			splits
		});
		console.log(destinations);
	}

	async function handleSplit(split) {
		let podcastData = await fetch(
			remoteServer +
				`/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${activeBlock.feedGuid}`)}`
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
