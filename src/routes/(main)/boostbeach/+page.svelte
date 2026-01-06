<script>
	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import Desktop from './Desktop/Desktop.svelte';
	import Mobile from './Mobile/Mobile.svelte';
	import { remoteServer, liveBlocks, mainSettings } from '$/stores';

	import { Confetti } from 'svelte-confetti';

	export let guid = '303fe7e4-32c1-4f67-977d-967f251cb6b0';
	export let controlGuid = '303fe7e4-32c1-4f67-977d-967f251cb6b0';

	let isMobile = false;
	let broadcastingBlock = {};

	let showConfetti = false;
	let confettiAmount = 1;
	let loaded = false;

	const checkScreenWidth = () => {
		isMobile = window.innerWidth < 996;
		loaded = true;
	};

	onMount(async () => {
		checkScreenWidth();
		window.addEventListener('resize', checkScreenWidth);

		loadBlocks();
		const url = remoteServer + '/event?event_id=' + controlGuid;
		const liveItemSocket = io.connect(url);

		liveItemSocket.on('remoteValue', function (data) {
			console.log(data);
			if (data.blockGuid) {
				broadcastingBlock = data;
			} else {
				broadcastingBlock = $liveBlocks[0];
			}
			console.log(broadcastingBlock);
		});
		liveItemSocket.on('playerPause', function (data) {
			// You will need to adjust this part based on the actual format of the data sent by the server
			console.log(data);
		});
		return () => window.removeEventListener('resize', checkScreenWidth);
	});

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			broadcastingBlock = data.blocks[0];
			$liveBlocks = data.blocks;
			$mainSettings = data.settings;
		}
	}

	const boostArt = {
		default: ['url(/flower.png)', 'url(/flower2.png)', 'url(/flower3.png)'],
		weed: ['url(/weed.png)'],
		boob: ['url(/boobs.png)'],
		dick: ['url(/dick.png)']
	};

	function selectBoostArt() {
		if (confettiAmount >= 1111 && /^1+$/.test(String(confettiAmount))) {
			return boostArt.dick;
		} else if (String(confettiAmount).includes('420')) {
			return boostArt.weed;
		} else if (confettiAmount === 8008 || confettiAmount === 80085) {
			return boostArt.boob;
		} else {
			return boostArt.default;
		}
	}

	function throwConfetti(amount) {
		showConfetti = true;
		confettiAmount = amount;
		setTimeout(() => {
			showConfetti = false;
		}, 6000);
	}
</script>

<div class="container" class:loaded>
	{#if isMobile}
		<Mobile {guid} {broadcastingBlock} {throwConfetti} />
	{:else}
		<Desktop {guid} {broadcastingBlock} {throwConfetti} />
	{/if}
</div>

{#if showConfetti}
	<div class="confetti left">
		<Confetti cone size="30" duration={6000} x={[0, 2]} y={[0, 3]} colorArray={selectBoostArt()} />
	</div>
	<div class="confetti right">
		<Confetti cone size="30" duration={6000} x={[-2, 0]} y={[0, 3]} colorArray={selectBoostArt()} />
	</div>
{/if}

<style>
	.container {
		position: relative;
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: none;
	}
	.loaded {
		display: initial;
	}
	.confetti {
		position: absolute;
		bottom: 0;
	}

	.confetti.right {
		right: 0;
	}
</style>
