export default function createChapterBroadcast(chapters, chapterIndex, chapterBlock) {
	if (chapterIndex > -1) {
		let activeChapter = chapters[chapterIndex];
		if (activeChapter) {
			chapterBlock.title = activeChapter.title;
			chapterBlock.line = [];
			chapterBlock.image = activeChapter.img;
			chapterBlock.link = activeChapter.url
				? { text: activeChapter.url, url: activeChapter.url }
				: undefined;
			return chapterBlock;
		}
	}
}
