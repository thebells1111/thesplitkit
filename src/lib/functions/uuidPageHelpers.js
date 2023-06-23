export async function loadPodcast(fetch, params) {
	let data = await fetchEpisodes(fetch, params.guid);

	const value = [];

	for (const obj of data?.value?.destinations) {
		const { address, ...otherProps } = obj;
		value.push({ address: address, ...otherProps });
	}

	return {
		name: data.title,
		imageLink: data.artwork || data.image,
		websiteLink: data.link,
		value,
		podcastGuid: data.podcastGuid,
		fromIndex: true
	};
}

export async function loadEpisode(fetch, params) {
	let data = await fetchEpisodes(fetch, params.guid);
	let episode = data.episodes.find((obj) => obj.guid == params.episode) || {};

	let destinations = episode?.value?.destinations || data?.value?.destinations;
	const value = [];

	for (const obj of destinations) {
		const { address, ...otherProps } = obj;
		value.push({ address: address, ...otherProps });
	}

	return {
		name: data.title || '',
		subtitle: episode.title || '',
		imageLink:
			(isValidUrl(episode.artwork) && episode.artwork) ||
			(isValidUrl(episode.image) && episode.image) ||
			data.artwork ||
			data.image,
		websiteLink: (isValidUrl(episode.link) && episode.link) || data.link,
		value,
		fromIndex: true
	};
}

export function isUUID(str) {
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	console.log(uuidRegex.test(str));
	return uuidRegex.test(str);
}

export async function fetchEpisodes(fetch, guid) {
	let feedUrl = `/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${guid}`)}`;
	let episodesUrl = `/api/queryindex?q=${encodeURIComponent(
		`/episodes/bypodcastguid?guid=${guid}`
	)}`;

	try {
		let feedRes = await fetch(feedUrl);
		let data = await feedRes.json();
		let feed = data.feed;

		let episodesRes = await fetch(episodesUrl);
		let episodesData = await episodesRes.json();
		let episodes = [].concat(episodesData.items);

		feed.episodes = episodes;
		return feed;
	} catch (err) {
		console.error('Error fetching episodes:', err);
	}
}

export function isValidUrl(url) {
	const pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	); // fragment locator
	return !!pattern.test(url);
}
