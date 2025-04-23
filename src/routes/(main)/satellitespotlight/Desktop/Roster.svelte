<script>
	import Card from '../Card.svelte';
	import Banner from '../Banner.svelte';
	import { onMount } from 'svelte';
	import QR from '../QR.svelte';
	import BoostPage from '../BoostPage.svelte';

	import { remoteServer, liveBlocks, activePageGuid, mainSettings } from '$/stores';

	export let guid;

	$activePageGuid = guid;

	let showModal = false;
	let activeBlock = {};

	onMount(() => {
		loadBlocks();
	});

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
			$mainSettings = data.settings;
			console.log(data);
			console.log($liveBlocks);
		}
	}
</script>

<p class="instructions">CLICK A BAND TO BOOST</p>

<div class="container">
	<div class="support">Support the Crew</div>

	<div class="bands">
		{#each $liveBlocks.slice(1, Math.ceil($liveBlocks.length / 2)) as block}
			{#if block}
				<Card {block} bind:showModal bind:activeBlock class="card" />
			{/if}
		{/each}

		{#if $liveBlocks[0]}
			<Banner block={$liveBlocks[0]} bind:showModal bind:activeBlock class="banner" />
		{/if}

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
