<script>
	import { onMount } from 'svelte';
	import Desktop from './Desktop/Desktop.svelte';
	import Mobile from './Mobile/Mobile.svelte';
	import { remoteServer, liveBlocks, mainSettings } from '$/stores';

	export let guid = '1e34e11b-f536-4280-b068-7dd1a9399b12';

	let isMobile = false;
	let broadcastingBlock = {};

	const checkScreenWidth = () => {
		isMobile = window.innerWidth < 720;
	};

	onMount(() => {
		checkScreenWidth();
		window.addEventListener('resize', checkScreenWidth);
		return () => window.removeEventListener('resize', checkScreenWidth);
	});

	onMount(async () => {
		loadBlocks();
		const url = remoteServer + '/event?event_id=' + guid;
		const liveItemSocket = io.connect(url);

		liveItemSocket.on('remoteValue', function (data) {
			console.log(data);
			broadcastingBlock = data;
		});
		liveItemSocket.on('playerPause', function (data) {
			// You will need to adjust this part based on the actual format of the data sent by the server
			console.log(data);
		});
	});

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
			$mainSettings = data.settings;
		}
	}
</script>

{#if isMobile}
	<Mobile {guid} {broadcastingBlock} />
{:else}
	<Desktop {guid} {broadcastingBlock} />
{/if}
