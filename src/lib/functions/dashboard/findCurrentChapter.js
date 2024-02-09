export default function findCurrentChapter(chapters, currentTime) {
	let potentialChapters = [];
	for (let i = 0; i < chapters.length; i++) {
		if (currentTime >= chapters[i].startTime) {
			if (currentTime <= chapters[i].endTime) {
				potentialChapters.push(i);
			}
		} else {
			break;
		}
	}

	if (potentialChapters.length) {
		return potentialChapters[potentialChapters.length - 1];
	}
	return -1; // Returns the index of the last chapter that matches the criteria, or -1 if not found.
}
