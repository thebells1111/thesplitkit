<script>
	import QRCode from 'qrcode';
	import { onMount, onDestroy } from 'svelte';

	let qrCodeCanvas;
	let container;
	export let code = 'tsk-1e34e11b-f536-4280-b068-7dd1a9399b12@thesplitbox.com';
	export let imgSrc = '';
	let observer;

	function generateQRCode() {
		if (!qrCodeCanvas || !container) return;

		const size = container.clientWidth;

		QRCode.toCanvas(qrCodeCanvas, code, {
			width: size,
			color: {
				dark: '#430109',
				light: '#ECDCD400'
			}
		}).catch(console.error);
	}

	onMount(() => {
		generateQRCode();

		observer = new ResizeObserver(generateQRCode);
		if (container) observer.observe(container);
	});

	onDestroy(() => {
		if (observer && container) observer.unobserve(container);
	});
</script>

<div class="qr-wrapper" bind:this={container}>
	{#if imgSrc}
		<img src="./qrbg.png" alt="QR Background" />
	{/if}
	<canvas bind:this={qrCodeCanvas} />
</div>

<style>
	.qr-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
	}

	img,
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
