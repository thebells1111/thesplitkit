import { remoteServer } from '$/stores';

export default async function sendBoost({ block, satAmount, boostagram, senderName, addIndex }) {
	let destinations = block?.value?.destinations || [];

	let feesDestinations = destinations.filter((v) => v.fee);
	let splitsDestinations = destinations.filter((v) => !v.fee);

	let splitKitObject = {
		name: 'The Split Kit',
		customKey: '696969',
		customValue: 'boPNspwDdt7axih5DfKs',
		address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
		type: 'node',
		split: '5',
		fee: true
	};

	if (
		!feesDestinations.some(
			(item) =>
				item.customKey === splitKitObject.customKey &&
				item.customValue === splitKitObject.customValue &&
				item.address === splitKitObject.address
		)
	) {
		feesDestinations = feesDestinations.concat(splitKitObject);
	}

	let payments = [];
	let runningTotal = satAmount;
	console.log(satAmount);
	for (const dest of feesDestinations) {
		let amount = Math.round((Number(dest['split']) / 100) * satAmount);
		if (amount) {
			runningTotal -= amount;
			await processDestination(block, dest, amount);
		}
	}

	for (const dest of splitsDestinations) {
		let amount = Math.round((Number(dest['split']) / 100) * runningTotal);
		if (amount >= 1) {
			await processDestination(block, dest, amount);
		}
	}

	let res = await fetch(remoteServer + '/api/alby/boost', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payments)
	});

	let data = await res.json();
	return data;

	async function processDestination(block, dest, amount) {
		let record = getBaseRecord(block, satAmount, boostagram, senderName);
		record.name = dest.name;
		record.value_msat = amount * 1000;
		let customRecords = { 7629169: JSON.stringify(record) };
		if (dest.customKey) {
			customRecords[dest.customKey] = dest.customValue;
		}

		let payload = {
			destination: dest.address,
			amount: amount,
			customRecords: customRecords
		};

		payments.push(payload);
		return payload;
	}
}

const getBaseRecord = (block, satAmount, boostagram, senderName) => {
	return {
		podcast: block.title,
		action: 'boost',
		app_name: 'The Split Kit',
		value_msat: 0,
		value_msat_total: satAmount * 1000,
		name: undefined,
		message: boostagram,
		sender_name: senderName || 'anonymous ',
		remoteFeedGuid: block.feedGuid,
		remoteItemGuid: block.itemGuid,
		eventGuid: block.eventGuid,
		blockGuid: block.blockGuid,
		eventAPI: block.eventAPI
	};
};
