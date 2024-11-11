import { v4 as uuidv4 } from 'uuid';
import getMediaDuration from '$lib/functions/getMediaDuration.js';

import { mainSettings, liveBlocks, changeDefault } from '$/stores';
import { get } from 'svelte/store';

export default async function addFeed(block, type, channel, eventGuid) {
	const $mainSettings = get(mainSettings);
	let $liveBlocks = get(liveBlocks);
	const $changeDefault = get(changeDefault);
	if (!eventGuid) {
		throw new Error('eventGuid is required');
	}
	block.value = block?.value || channel?.value;

	let newBlock = {};
	newBlock.image = block?.artwork || block?.image || channel?.artwork || channel?.image;
	if (channel) {
		newBlock.title = block?.title;
		newBlock.line = [channel?.title, channel?.author];
	} else {
		newBlock.title = block?.title;
		newBlock.line = [channel?.author];
	}

	newBlock.description = block.description;
	newBlock.value = block?.value ||
		channel?.value || {
			model: {
				type: 'lightning',
				method: 'keysend'
			},
			destinations: []
		};
	newBlock.type = type;

	newBlock.link = {
		text: 'Checkout the Album',
		url: block?.link || channel?.link || `https://podcastindex.org/podcast/${channel.id}`
	};
	newBlock.chaptersUrl = block?.chaptersUrl;

	if (block.enclosureUrl) {
		newBlock.enclosureUrl = block.enclosureUrl;
	}

	newBlock.feedGuid = channel?.podcastGuid || block?.podcastGuid;

	console.log(block);
	newBlock.itemGuid = block.guid;

	newBlock.eventGuid = eventGuid;
	newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

	if (block.enclosureUrl) {
		newBlock.enclosureUrl = block.enclosureUrl;
		if (!$mainSettings?.lowBandwidth?.audio) {
			newBlock.duration = await getMediaDuration(block.enclosureUrl);
		}
	}

	let blockGuid;
	do {
		blockGuid = generateBlockGuid();
	} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

	newBlock.blockGuid = blockGuid;
	newBlock.settings = {
		split: $mainSettings.splits
	};
	console.log($liveBlocks);

	if ($changeDefault) {
		$defaultBlockGuid = blockGuid;
		newBlock.settings.default = true;
		$liveBlocks[0] = newBlock;
		$changeDefault = false;
	} else if ($mainSettings.broadcastMode === 'edit' && !$liveBlocks.length) {
		$liveBlocks = [undefined, newBlock];
	} else {
		$liveBlocks = $liveBlocks.concat(newBlock);
	}
	liveBlocks.set($liveBlocks);
	console.log($liveBlocks);
	console.log(newBlock);
	// remoteSave($liveBlocks, eventGuid);
	return newBlock;
}

function generateBlockGuid() {
	let uniqueId = uuidv4();
	return uniqueId;
}

function isBlockGuidUnique(blockGuid, blocks) {
	for (let block of blocks) {
		if (block?.blockGuid === blockGuid) {
			return false;
		}
	}
	return true;
}
