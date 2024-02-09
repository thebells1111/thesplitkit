import { remoteServer } from '$/stores';

export default async function fetchChapters(episode) {
	if (episode?.chaptersUrl) {
		try {
			const response = await fetch(remoteServer + '/api/proxy?url=' + episode.chaptersUrl);
			if (!response.ok) {
				throw new Error('Network response was not OK');
			}
			const data = await response.json();
			if (data.chapters) return preprocessChapters(data.chapters);
		} catch (error) {
			console.error('Error fetching chapter data: ', error);
		}
	}
}

function preprocessChapters(chapters) {
	// Sort chapters by startTime
	chapters.sort((a, b) => a.startTime - b.startTime);

	// Iterate through chapters to assign missing endTimes
	for (let i = 0; i < chapters.length; i++) {
		if (!chapters[i].hasOwnProperty('endTime')) {
			// Find the next chapter that doesn't have an endTime
			let nextChapterWithNoEndTime = chapters
				.slice(i + 1)
				.find((chap) => !chap.hasOwnProperty('endTime'));

			// If found, use its startTime as the endTime for the current chapter
			if (nextChapterWithNoEndTime) {
				chapters[i].endTime = nextChapterWithNoEndTime.startTime;
			} else {
				// If no such chapter exists, set endTime to Infinity
				chapters[i].endTime = Infinity;
			}
		}
	}

	return chapters;
}
