<script>
	import QRCode from 'qrcode';
	import { onMount, onDestroy } from 'svelte';

	let qrCodeCanvas;
	let container;
	export let code = 'tsk-58eb81f8-caeb-4c77-a326-36e406207fe0@splitbox.ericpp.dev';
	export let imgSrc = '';
	let observer;

	function generateQRCode() {
		if (!qrCodeCanvas || !container) return;

		const size = container.clientWidth;

		QRCode.toCanvas(qrCodeCanvas, code, {
			width: size,
			color: {
				dark: '#000000',
				light: '#ffffff'
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

	function copyCodeToClipboard() {
		navigator.clipboard.writeText(code);
		alert('Copied Link to clipboard');
	}
</script>

<button class="qr-wrapper" bind:this={container} on:click={copyCodeToClipboard}>
	{#if imgSrc}
		<img src="./qrbg.png" alt="QR Background" />
	{/if}
	<canvas bind:this={qrCodeCanvas} />
	<p>- click invoice to copy to clipboard -</p>
</button>

<style>
	.qr-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: transparent;
		border: none;
		box-shadow: none;
	}

	img,
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	p {
		position: absolute;
		bottom: -24px;
		color: #ffffff;
		padding: 0;
		margin: 0;
	}
</style>
