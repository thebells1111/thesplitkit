<script>
	import Card from '../Card.svelte';
	import Banner from '../Banner.svelte';
	import QR from '../QR.svelte';
	import BoostPage from '../BoostPage.svelte';
	import PaymentSelector from '../PaymentSelector.svelte';
	import { page } from '$app/stores';

	import { liveBlocks, albyClientId, user } from '$/stores';

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	let showModal = false;
	export let broadcastingBlock;
	export let showInstructions;
	export let throwConfetti;
	let paymentType;

	$: console.log(paymentType);
	$: console.log(showModal);
</script>

<div class="container">
	<button
		class="boost-btn boost"
		on:click={() => {
			showModal = true;
		}}
	>
		Boost
	</button>
</div>

{#if showModal}
	{#if !paymentType && !$user.loggedIn}
		<PaymentSelector bind:paymentType bind:showModal />
	{:else}
		<BoostPage bind:showModal {broadcastingBlock} {paymentType} {throwConfetti} />
	{/if}
{/if}

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		box-sizing: border-box;
		overflow: hidden;
	}

	.boost-btn {
		background: #f7931a;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-size: 48px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.boost-btn:hover {
		background: #e8850f;
	}
</style>
