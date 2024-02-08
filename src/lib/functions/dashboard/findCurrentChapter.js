export default function findCurrentChapter(chapters, currentTime) {
	let left = 0;
	let right = chapters.length - 1;

	while (left <= right) {
		let mid = Math.floor((left + right) / 2);
		let start = chapters[mid].startTime;
		let end = chapters[mid + 1] ? chapters[mid + 1].startTime : Infinity;

		if (currentTime >= start && currentTime < end) {
			return mid; // Found the current chapter
		} else if (currentTime < start) {
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}

	return -1; // Indicates no current chapter found
}
