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
	let activeBlock = {};
	export let broadcastingBlock;
	export let showInstructions;
	let paymentType;

	$: console.log(paymentType);
	$: console.log(showModal);
</script>

<p
	class="instructions"
	on:click={() => {
		showInstructions = true;
	}}
>
	How do I boost?
</p>

<div class="container">
	{#if $liveBlocks[0]}
		<Banner
			block={$liveBlocks[0]}
			bind:showModal
			bind:activeBlock
			class="crew"
			imgSrc="./crewsupport.png"
		/>
	{/if}

	<div class="bands">
		{#each $liveBlocks.slice(1, Math.ceil($liveBlocks.length / 2)) as block}
			{#if block}
				<Card {block} bind:showModal bind:activeBlock class="card" bind:paymentType />
			{/if}
		{/each}

		<Banner
			block={broadcastingBlock?.img ? broadcastingBlock : $liveBlocks[0]}
			bind:showModal
			bind:activeBlock
			class="banner"
		/>

		{#each $liveBlocks.slice(Math.ceil($liveBlocks.length / 2)) as block}
			{#if block}
				<Card {block} bind:showModal bind:activeBlock class="card" />
			{/if}
		{/each}
	</div>

	<div class="qr-wrapper">
		<QR />
	</div>
</div>

{#if showModal}
	{#if !paymentType && !$user.loggedIn}
		<PaymentSelector bind:paymentType />
	{:else}
		<BoostPage bind:showModal bind:activeBlock {paymentType} />
	{/if}
{/if}

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		box-sizing: border-box;
		overflow: hidden;
	}

	.bands {
		display: flex;
		flex: 1 1 auto;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		min-width: 0;
		overflow: hidden;
	}

	.qr-wrapper {
		width: clamp(80px, 15vw, 180px);
		aspect-ratio: 1;
	}

	p.instructions {
		color: rgb(67, 1, 9);
		background-color: hsla(20, 39%, 88%, 0.5);
		position: absolute;
		bottom: 8px;
		padding: 4px 0;
		width: 180px;
		left: 24px;
		margin: 0 auto;
		font-weight: 600;
		backdrop-filter: blur(10px);
		text-align: center;
		cursor: pointer;
	}
</style>
