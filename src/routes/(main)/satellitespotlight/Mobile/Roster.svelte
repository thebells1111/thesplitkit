<script>
	import Card from '../Card.svelte';
	import Banner from '../Banner.svelte';
	import { onMount } from 'svelte';
	import QR from '../QR.svelte';
	import BoostPage from '../BoostPage.svelte';

	import { remoteServer, liveBlocks, activePageGuid, mainSettings } from '$/stores';

	export let guid;

	$activePageGuid = guid;
	let mobile;

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

<p class="instructions" class:mobile>CLICK A BAND TO BOOST</p>
<div class="container" class:mobile>
	{#if $liveBlocks[0]}
		<Banner block={$liveBlocks[0]} bind:showModal bind:activeBlock />
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

	.container.mobile {
		height: 100%;
		flex-direction: column;
	}

	.bands {
		flex-grow: 1;
		display: flex;
		justify-content: center;
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

	.support {
		background-color: antiquewhite;
		width: 180px;
		height: 180px;
		border-radius: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
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
		backdrop-filter: blur(10px); /* Adjust the blur level */
	}

	p.instructions.mobile {
		position: relative;
		bottom: 0;
	}
</style>
