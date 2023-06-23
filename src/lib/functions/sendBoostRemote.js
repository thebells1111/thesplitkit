import { remoteServer } from '$/stores';

export default async function sendBoost({ item, satAmount, boostagram, senderName, addIndex }) {
	let destinations = item.value.destinations;

	let feesDestinations = destinations.filter((v) => v.fee);
	let splitsDestinations = destinations.filter((v) => !v.fee);

	let payments = [];
	let runningTotal = satAmount;
	for (const dest of feesDestinations) {
		let amount = Math.round((Number(dest['split']) / 100) * satAmount);
		if (amount) {
			runningTotal -= amount;
			await processDestination(item, dest, amount);
		}
	}

	for (const dest of splitsDestinations) {
		let amount = Math.round((Number(dest['split']) / 100) * runningTotal);
		if (amount >= 1) {
			await processDestination(item, dest, amount);
		}
	}

	let res = await fetch(remoteServer + '/api/alby/boost', {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payments)
	});

	let data = await res.json();
	console.log(data);

	async function processDestination(item, dest, amount) {
		let record = getBaseRecord(item, satAmount, boostagram, senderName);
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
	}
}

const getBaseRecord = (entry, satAmount, boostagram, senderName) => {
	return {
		podcast: entry.name,
		action: 'boost',
		app_name: 'The Split Kit',
		value_msat: 0,
		value_msat_total: satAmount * 1000,
		name: undefined,
		message: boostagram,
		sender_name: senderName || 'anonymous '
	};
};
