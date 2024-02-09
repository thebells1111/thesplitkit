export default function createChapterBroadcast(chapters, chapterIndex, broadcastingBlock) {
	if (chapterIndex > -1) {
		let activeChapter = chapters[chapterIndex];
		if (activeChapter) {
			broadcastingBlock.title = activeChapter.title;
			broadcastingBlock.line = [];
			broadcastingBlock.image = activeChapter.img;
			broadcastingBlock.link = activeChapter.url
				? { text: activeChapter.url, url: activeChapter.url }
				: undefined;
			return broadcastingBlock;
		}
	}
}
