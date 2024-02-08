import clone from 'just-clone';
import { defaultBlockGuid, mainSettings, liveBlocks } from '$/stores';
import { get } from 'svelte/store';

const $defaultBlockGuid = get(defaultBlockGuid);
const $mainSettings = get(mainSettings);
const $liveBlocks = get(liveBlocks);

export default function processBlock(block) {
	let defaultBlock =
		block?.blockGuid === $defaultBlockGuid
			? undefined
			: $liveBlocks.find((v) => v?.blockGuid === $defaultBlockGuid);
	let split = defaultBlock ? block.settings.split : 100;

	let newDestinations = [];

	if (['playlist', 'podcast'].find((v) => v === $mainSettings.broadcastMode)) {
		if (defaultBlock) {
			newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations, true));
			let splitDeduct = block?.value?.destinations?.length ? split : 0;

			newDestinations = newDestinations.concat(
				updateSplits(defaultBlock?.value?.destinations, 100 - splitDeduct)
			);
			newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
			newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));
		} else {
			newDestinations = block?.value?.destinations ? block.value.destinations : [];
		}
	} else {
		if (defaultBlock) {
			newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations, true));
			let splitDeduct = block?.value?.destinations?.length ? split : 0;
			newDestinations = newDestinations.concat(
				updateSplits(defaultBlock?.value?.destinations, 100 - splitDeduct, true)
			);
		}
		newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
		newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));
	}

	delete block.settings;

	if (!block?.link?.text || block?.link?.text === 'Link - click to edit') {
		block.link = block.link || {};
		block.link.text = block?.link?.url;
	}

	if (!block?.link?.url) {
		delete block.link;
	}

	if (block?.value?.destinations) {
		block.value.destinations = newDestinations;
	}

	return block;
}

function addFees(destinations, isDefault) {
	let splitKitObject = {
		name: 'The Split Kit',
		customKey: '696969',
		customValue: 'boPNspwDdt7axih5DfKs',
		address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
		type: 'node',
		split: '5',
		fee: true
	};

	let episodeestinations = destinations?.filter((v) => v.fee) || [];

	if (!isDefault) {
		episodeestinations.push(splitKitObject);
	}
	episodeestinations.forEach((v) => (v.split = v.split.toString()));
	return episodeestinations;
}

function updateSplits(destinations, split) {
	return clone(destinations)
		?.filter((v) => !v.fee)
		?.map((v) => {
			v.split = ((v.split * split) / 100).toString();
			return v || [];
		});
}
