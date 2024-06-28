<script>
	import { remoteServer } from '$/stores';
	import invoicesJSON from './test.json';
	import BoostagramCard from './BoostagramCard.svelte';

	let invoices = invoicesJSON;
	let boostagrams = [];
	let currentPage = 1;

	async function getInvoice(page) {
		if (page == 1) {
			invoices = [];
		}
		const res = await fetch(remoteServer + `/api/alby/invoice?page=${page}`, {
			credentials: 'include'
		});

		const data = await res.json();
		invoices = invoices.concat(data);

		if (page <= 200) {
			currentPage = page + 1;
			getInvoice(currentPage);
		} else {
			console.log(invoices);
			currentPage = 1;
		}
	}

	function showInvoice() {
		console.log(invoices);
		boostagrams = [];
		processBoostagrams(invoices);
		boostagrams = boostagrams.sort((a, b) => (a.created > b.created ? -1 : 1));
		console.log(boostagrams);
	}

	function processBoostagrams(invoices) {
		invoices.forEach((v) => {
			if (v.comment) {
				boostagrams.push({
					comment: v.comment,
					amount: v.amount,
					created: v.creation_date * 1000,
					name: v.payer_name
				});
			}
		});
	}
</script>

<button on:click={getInvoice.bind(this, 1)}>Get Invoice</button>
<button on:click={showInvoice}>Show Invoice</button>
{currentPage}

<div class="boostagrams">
	{#each boostagrams as boostagram}
		<BoostagramCard {boostagram} />
	{/each}
</div>

<style>
	button {
		width: 50%;
		margin: 8px;
	}

	.boostagrams {
		height: 80%;
		overflow: auto;
	}
</style>
