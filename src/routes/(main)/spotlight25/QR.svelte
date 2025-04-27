<script>
	import QRCode from 'qrcode';
	import { onMount, onDestroy } from 'svelte';

	let qrCodeCanvas;
	let container;
	let code = 'tsk-1e34e11b-f536-4280-b068-7dd1a9399b12@thesplitbox.com';
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

	function copyAddressToClipboard() {
		navigator.clipboard.writeText(code);
		alert('Copied address to clipboard');
	}
</script>

<div class="qr-wrapper" bind:this={container} on:click={copyAddressToClipboard}>
	<img src="./qrbg.png" alt="QR Background" />
	<canvas bind:this={qrCodeCanvas} />
</div>

<style>
	.qr-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		cursor: pointer;
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
