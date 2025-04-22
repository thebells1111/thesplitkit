<script>
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	let qrCodeCanvas;
	let code = 'tsk-1e34e11b-f536-4280-b068-7dd1a9399b12@thesplitbox.com';

	async function generateQRCode() {
		if (!qrCodeCanvas) {
			return;
		}

		try {
			await QRCode.toCanvas(qrCodeCanvas, code, {
				width: 180
			});
		} catch (err) {
			console.error(err);
		}
	}

	onMount(generateQRCode);
	generateQRCode();
</script>

<canvas bind:this={qrCodeCanvas} />
