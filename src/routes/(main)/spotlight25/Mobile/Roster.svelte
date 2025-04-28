<script>
	import Card from '../Card.svelte';
	import Banner from '../Banner.svelte';
	import QR from '../QR.svelte';
	import BoostPage from '../BoostPage.svelte';

	import { liveBlocks } from '$/stores';

	let showModal = false;
	let activeBlock = {};
	export let broadcastingBlock;
	export let showInstructions;
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
			block={broadcastingBlock?.img ? broadcastingBlock : $liveBlocks[0]}
			bind:showModal
			bind:activeBlock
		/>
	{/if}
	<div class="grid">
		{#each $liveBlocks.slice(1) as block, i}
			{#if block}
				<div class="grid-item">
					<Card {block} bind:showModal bind:activeBlock />
				</div>
			{/if}
		{/each}
	</div>
	{#if $liveBlocks[0]}
		<Banner
			block={$liveBlocks[0]}
			bind:showModal
			bind:activeBlock
			class="crew"
			imgSrc="./crewsupport.png"
		/>
	{/if}
</div>

{#if showModal}
	<BoostPage bind:showModal bind:activeBlock />
{/if}

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.container {
		height: 100%;
		flex-direction: column;
	}

	.grid {
		margin-top: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		gap: 8px 8px; /* 8px between rows and columns */
		height: calc(100% - 150px);
		overflow: hidden;
	}
	.grid-item {
		width: calc(40% - 10px); /* Two per row with 8px gap */
		box-sizing: border-box;
		min-height: 0;
		min-width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	p {
		text-align: center;
	}

	p.instructions {
		color: rgb(67, 1, 9);
		background-color: hsla(20, 39%, 88%, 0.5);
		position: relative;
		padding: 4px 0;
		width: 180px;
		margin: 0 auto;
		font-weight: 600;
		backdrop-filter: blur(10px); /* Adjust the blur level */
		margin-bottom: 8px;
	}
</style>
