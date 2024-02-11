export default function getNextBlock(liveBlocks, block) {
	console.log(liveBlocks);
	console.log(block);
	let index = liveBlocks.findIndex((v) => v?.blockGuid === block?.blockGuid);
	console.log(index);
	if (index > -1 && index < liveBlocks.length - 1) {
		return liveBlocks[index + 1];
	} else {
		return null;
	}
}
