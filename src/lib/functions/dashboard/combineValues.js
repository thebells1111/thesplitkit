import clone from 'just-clone';
import normalizeSplitAmount from './normalizeSplitAmount';

export default function combineValues({ defaultRemotePercent, activeValue, splits }) {
	let { baseValue, remoteValue, remotePercentage } = splits;
	if (!defaultRemotePercent || !baseValue || !remoteValue || !remotePercentage) {
		throw new Error('combineValue missing one or more arguments');
	}

	let newDestinations = [];

	let newActive = normalizeSplitAmount(activeValue.destinations).map((v) => {
		let x = clone(v);
		if (!x.fee) {
			x.split = x.split * ((100 - defaultRemotePercent) / 100);
		}
		if (x.split) {
			return x;
		}
	});

	let newBaseValue = normalizeSplitAmount(baseValue.destinations).map((v) => {
		let x = clone(v);
		if (!x.fee) {
			x.split = x.split * (defaultRemotePercent / 100) * ((100 - remotePercentage) / 100);
		}
		if (x.split) {
			return x;
		}
	});

	let newRemoteValue = normalizeSplitAmount(remoteValue.destinations).map((v) => {
		let x = clone(v);
		if (!x.fee) {
			x.split = x.split * (defaultRemotePercent / 100) * (remotePercentage / 100);
		}
		if (x.split) {
			return x;
		}
	});

	newDestinations = newDestinations
		.concat(newActive)
		.concat(newBaseValue)
		.concat(newRemoteValue)
		.filter((v) => v);

	newDestinations = consolidateItems(newDestinations);

	return newDestinations;
}

function consolidateItems(items) {
	const uniqueItems = [];
	const found = {};

	items.forEach((item) => {
		const key = `${item.address}-${item.customKey || ''}-${item.customValue || ''}-${
			item.fee || false
		}`;
		if (found[key]) {
			if (item.fee) {
				// If the current item has a fee and a higher split, update the item in found
				if (item.split > found[key].split) {
					found[key].split = item.split;
					found[key].name = item.name; // Update name in case the highest split comes from a different named item
				}
			} else {
				// If the current item does not have a fee, just add its split to the total
				found[key].split += item.split;
			}
		} else {
			found[key] = { ...item };
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
