export default function getNextBlock(liveBlocks, block, loop) {
	console.log('loop: ', loop);
	let index = liveBlocks.findIndex((v) => v?.blockGuid === block?.blockGuid);
	console.log(index);
	if (index > -1 && index < liveBlocks.length - 1) {
		return liveBlocks[index + 1];
	} else {
		if (loop) {
			return liveBlocks[1];
		}
		return null;
	}
}
