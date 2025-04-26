<script>
	import Card from '../Card.svelte';
	import Banner from '../Banner.svelte';
	import QR from '../QR.svelte';
	import BoostPage from '../BoostPage.svelte';

	import { liveBlocks } from '$/stores';

	let showModal = false;
	let activeBlock = {};
	export let broadcastingBlock;
</script>

<p class="instructions">CLICK A BAND TO BOOST</p>

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
				<Card {block} bind:showModal bind:activeBlock class="card" />
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
	<BoostPage bind:showModal bind:activeBlock />
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

	.support {
		flex: 0 0 auto;
		width: min(20vw, 180px);
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: antiquewhite;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-align: center;
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

	.support,
	.qr-wrapper {
		width: clamp(80px, 15vw, 180px);
		aspect-ratio: 1;
	}
	.support {
		font-size: clamp(12px, 1.5vw, 24px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
	}

	p.instructions {
		color: rgb(67, 1, 9);
		background-color: hsla(20, 39%, 88%, 0.5);
		position: absolute;
		bottom: 8px;
		left: calc(50% - 110px);
		padding: 4px 8px;
		width: 220px;
		margin: 0 auto;
		font-weight: 600;
		backdrop-filter: blur(10px);
		text-align: center;
	}
</style>
