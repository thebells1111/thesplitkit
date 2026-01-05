<script>
	import { onMount } from 'svelte';

	import guid1 from './guid1';
	import guid2 from './guid2';

	let total = 0;
	let totalFees = 0;
	let failedPayments = [];
	let goodPayments = [];
	let failedTotal = 0;
	let weirdPayments = [];
	let forward = {};
	let dv = [];
	let board = {};

	onMount(() => {
		let completedpayments = guid1
			.concat(guid2)
			.filter((v) => v.settled)
			.filter((v) => v.completedPayments);

		completedpayments.forEach((v, i) => {
			v.completedPayments.forEach((w, j) => {
				total += w?.paymentData?.amount || 0;
				if (w.success) {
					goodPayments.push(w);

					let name = w.recipient['@_name'] || w.recipient.name;
					if (!board[name]) {
						board[name] = 0;
					}
					board[name] += w?.paymentData?.amount || 0;
				} else {
					failedPayments.push([v, w]);

					calculateFailAmount([v, w]);

					failedTotal += w.recipient.amount || 0;
				}
			});
		});

		// console.log(total);
		// console.log(goodPayments);
		// console.log(failedPayments);
		// console.log(failedTotal);

		// calculateFailAmount(failedPayments[10]);

		function calculateFailAmount(payment) {
			try {
				const event = payment[0];
				const failed = payment[1];

				const successful = event.completedPayments.find(
					(v) => v.success && v.paymentData?.custom_records?.['7629169']
				);
				if (!successful) throw new Error('No valid successful payment found');

				const tlv = JSON.parse(successful.paymentData.custom_records['7629169']);
				const boostAmount = tlv.value_msat_total / 1000;

				// Build matcher based on address and optional customKey/customValue
				const failedAddress = failed.recipient.address;
				const failedName = failed.recipient.name;
				const failedCustom = failed.paymentData?.custom_records;

				const matchedDest = event.value.destinations.find((dest) => {
					return dest.name === failedName;
					if (dest.address !== failedAddress) return false;

					// If destination has customKey, we must match it
					if (dest.customKey && dest.customValue) {
						if (!failedCustom) return false;
						return failedCustom[dest.customKey] === dest.customValue;
					}

					return true; // No customKey to check
				});

				if (!matchedDest) {
					throw new Error('No matching destination found');
				}

				const split = parseFloat(matchedDest.split);
				if (isNaN(split)) throw new Error('Invalid split');

				const failedAmount = Math.trunc((boostAmount * split) / 100);

				failedTotal += failedAmount;

				if (!forward[failedName]) {
					forward[failedName] = 0;
				}

				forward[failedName] += failedAmount;

				if (!board[failedName]) {
					board[failedName] = 0;
				}
				board[failedName] += failedAmount;
				if (failedName === 'DoerfelVerse_Node') {
					dv.push(event);
				}

				return failedAmount;
			} catch (error) {
				weirdPayments.push(payment);
			}
		}

		console.log(weirdPayments);
		console.log(goodPayments);
		console.log('Total Sats not forwarded: ', failedTotal);
		console.log(forward);
		console.log(board);

		const sorted = Object.entries(board).sort(([, a], [, b]) => b - a);

		console.log(sorted);
	});
</script>

Hi
