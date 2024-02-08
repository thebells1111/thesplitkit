export default function getEpisode(feed, blockGuid) {
	if (!feed || !blockGuid) {
		return;
	}
	if (feed.item) {
		feed.item = [].concat(feed.item);
	}
	return (feed?.item || []).find((v) => {
		return v?.guid?.['#text'] === blockGuid;
	});
}
