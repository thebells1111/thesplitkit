<script>
	import Modal from './Modal.svelte';
	import { goto } from '$app/navigation';

	export let showModal;
	export let paymentType;

	import { page } from '$app/stores';

	import { albyClientId, user } from '$/stores';

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<Modal bind:showModal>
	<boost-container>
		<h1>How would you like to boost?</h1>

		<div class="buttons">
			<button
				on:click={() => {
					if ($user.loggedIn) {
						paymentType = 'alby';
					} else {
						goto(redirectUrl);
					}
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
			<button
				on:click={() => {
					paymentType = 'venmo';
				}}
			>
				Venmo
			</button>
		</div>
	</boost-container>
</Modal>

<style>
	boost-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #222;
	}

	h1 {
		text-align: center;
		color: white;
	}

	button {
		font-size: 1em;
		cursor: pointer;
		margin: 8px;
		height: 50px;
		box-shadow: none;
		width: 180px;
		background: #f7931a;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	button:hover {
		background: #e8850f;
	}

	.buttons {
		padding-bottom: 128px;
	}
	@media (max-width: 410px) {
		boost-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			color: #222;
		}
	}
</style>
