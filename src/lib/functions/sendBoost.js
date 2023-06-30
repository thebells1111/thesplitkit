import { remoteServer } from '$/stores';

export default async function sendBoost({ block, satAmount, boostagram, senderName, addIndex }) {
	let destinations = block?.value?.destinations || [];

	let feesDestinations = destinations.filter((v) => v.fee);
	let splitsDestinations = destinations.filter((v) => !v.fee);

	let splitKitObject = {
		customKey: '696969',
		customValue: 'boPNspwDdt7axih5DfKs',
		address: '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
		name: 'The Split Kit',
		split: '5',
		fee: true
	};

	if (addIndex) {
		splitKitObject.split = '4';
		feesDestinations = feesDestinations.concat([
			splitKitObject,
			{
				name: 'Podcastindex.org',
				address: '03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a',
				split: 1,
				fee: true
			}
		]);
	} else {
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
