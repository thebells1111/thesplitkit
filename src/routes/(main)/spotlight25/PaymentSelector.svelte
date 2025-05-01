<script>
	import Modal from '$lib/Modal/Modal.svelte';
	import { goto } from '$app/navigation';

	export let showModal;
	export let paymentType;

	import { page } from '$app/stores';

	import { albyClientId } from '$/stores';

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<Modal bind:showModal imgSrc="./main-bg.png">
	<boost-container>
		<button
			on:click={() => {
				goto(redirectUrl);
			}}
		>
			Alby
		</button>
		<button
			on:click={() => {
				paymentType = 'qr';
			}}
		>
			Scan QR Code
		</button>
	</boost-container>
</Modal>

<style>
	boost-container {
		width: calc(100% - 16px);
		margin: 0 8px;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: #222;
		font-family: 'Tangerine';
	}

	button {
		background-color: hsl(2, 35%, 52%);
		color: rgb(233, 225, 229);
		padding: 4px 12px;
		border: none;
		border-radius: 25px;
		font-size: 1.6em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
		box-shadow: none;
		font-family: 'Tangerine';
	}
</style>
