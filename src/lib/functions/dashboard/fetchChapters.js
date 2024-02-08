import { remoteServer } from '$/stores';

export default async function fetchChapters(episode) {
	if (episode?.chaptersUrl) {
		try {
			const response = await fetch(remoteServer + '/api/proxy?url=' + episode.chaptersUrl);
			if (!response.ok) {
				throw new Error('Network response was not OK');
			}
			const data = await response.json();
			if (data.chapters) return data.chapters?.sort((a, b) => a.startTime - b.startTime);
		} catch (error) {
			console.error('Error fetching chapter data: ', error);
		}
	}
}
