import clone from 'just-clone';
import { defaultBlockGuid, mainSettings, liveBlocks } from '$/stores';
import { get } from 'svelte/store';

export default function processBlock(block) {
	const $defaultBlockGuid = get(defaultBlockGuid);
	const $mainSettings = get(mainSettings);
	const $liveBlocks = get(liveBlocks);
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
		block.value.destinations = consolidateItems(newDestinations).map((v) => {
			v.split = v.split.toString();
			return v;
		});
	}

	return block;
}

function consolidateItems(items) {
	const uniqueItems = [];
	const found = {};

	items.forEach((item) => {
		const key = `${item.address}-${item.customKey || ''}-${item.customValue || ''}-${
			item.fee || false
		}`;
		if (found[key]) {
			if (item.fee && item.fee !== 'false') {
				// If the current item has a fee and a higher split, update the item in found
				if (Number(item.split) > Number(found[key].split)) {
					found[key].split = Number(item.split);
					found[key].name = item.name; // Update name in case the highest split comes from a different named item
				}
			} else {
				// If the current item does not have a fee, just add its split to the total
				found[key].split += Number(item.split);
			}
		} else {
			found[key] = { ...item };
			found[key].split = Number(found[key].split);
			uniqueItems.push(found[key]);
		}
	});

	return uniqueItems.filter(
		(item) =>
			!item.fee ||
			(item.fee &&
				item.split ===
					found[
						`${item.address}-${item.customKey || ''}-${item.customValue || ''}-${item.fee || false}`
					].split)
	);
}

function addFees(destinations, isDefault) {
	let splitKitObject = {
		name: 'The Split Kit',
		address: '035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8',
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
