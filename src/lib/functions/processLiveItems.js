import removeAtSign from './removeAtSign';

function processLiveItems(tempItems) {
	tempItems = tempItems ? [].concat(tempItems) : tempItems;
	let liveItems = tempItems?.map((v) => {
		let item = {
			title: v.title,
			guid: v?.guid?.['#text'] || v?.guid,
			author: v['itunes:author'],
			image: v?.image?.url,
			artwork: v?.['itunes:image']?.['@_href'],
			description: v.description,
			value: {
				type: 'lightning',
				method: 'keysend',
				destinations: []
			}
		};

		if (v?.['podcast:value']) {
			item.value = {};
			item.value.type = v?.['podcast:value']?.['@_type'];
			item.value.method = v?.['podcast:value']?.['@_method'];
			item.value.destinations = removeAtSign(v?.['podcast:value']?.['podcast:valueRecipient']);
		}

		return item;
	});
	return liveItems;
}

export default processLiveItems;
