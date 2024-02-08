import { liveBlocks } from '$/stores';
import { get } from 'svelte/store';

const $liveBlocks = get(liveBlocks);

export default function getNextBlock(block) {
	let index = $liveBlocks.findIndex((v) => v?.blockGuid === block?.blockGuid);
	if (index > -1 && index < $liveBlocks.length - 1) {
		return $liveBlocks[index + 1];
	} else {
		return null;
	}
}
