<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { saveAs } from 'file-saver';
	import { page } from '$app/stores';

	export let liveGuid;
	export let eventGuid;
	export let blockGuid;
	let guid;
	let code = '';

	if (liveGuid) {
		guid = liveGuid;
		code = `${$page.url.origin}/live/${liveGuid}`;
	}

	if (eventGuid && blockGuid) {
		guid = eventGuid + '-' + blockGuid;
		code = `${$page.url.origin}/promotion/${eventGuid}/${blockGuid}`;
	}

	let qrCodeCanvas;
	let fileInput;

	onMount(generateQRCode);

	async function generateQRCode() {
		if (!qrCodeCanvas) {
			return;
		}

		try {
			await QRCode.toCanvas(qrCodeCanvas, code, {
				width: 300
			});
		} catch (err) {
			console.error(err);
		}
	}

	async function copyQRToClipboard() {
		if (!qrCodeCanvas) {
			return;
		}

		try {
			const dataUrl = qrCodeCanvas.toDataURL();
			const response = await fetch(dataUrl);
			const blob = await response.blob();
			const item = new ClipboardItem({ 'image/png': blob });
			await navigator.clipboard.write([item]);
			alert('QR code copied to clipboard');
		} catch (err) {
			console.error(err);
		}
	}

	async function saveQRCode() {
		if (!qrCodeCanvas) {
			return;
		}

		try {
			const dataUrl = qrCodeCanvas.toDataURL();
			const response = await fetch(dataUrl);
			const blob = await response.blob();
			saveAs(blob, `qr-code-${guid}.png`);
		} catch (err) {
			console.error(err);
		}
	}

	function copyLinkToClipboard() {
		const link = code;
		navigator.clipboard.writeText(link);
		console.log(link);
		alert('Copied Link to clipboard');
	}
</script>

{#if guid}
	<div class="qr-container">
		<canvas bind:this={qrCodeCanvas} />
		<button-row>
			<button class="copy-qr" on:click={copyQRToClipboard}>Copy QR Code to Clipboard</button>
			<button class="dl-qr" on:click={saveQRCode}>Download QR Code</button>
		</button-row>

		<input type="url" disabled value={code} />
		<button class="dl-link" on:click={copyLinkToClipboard}>Copy Link to Clipboard</button>
		<!-- <button class="dl-link" on:click={() => (showButtonModal = true)}
			>Create Embeddable Button</button
		> -->
		<input type="file" bind:this={fileInput} webkitdirectory />
	</div>
{/if}

<style>
	.qr-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	button {
		margin: 1rem;
	}

	button-row {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	input[type='file'] {
		display: none;
	}
	input[type='url'] {
		width: 300px;
		padding: 8px;
		max-width: calc(100% - 32px);
	}

	button {
		width: 200px;
		font-weight: 700;
		border-radius: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		height: 32px;
		background-color: rgb(0, 57, 180);
		color: white;
		box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.5);
	}

	.dl-qr {
		background-color: rgb(0, 132, 180);
	}

	.dl-link {
		background-color: rgb(105, 0, 180);
	}

	@media (max-width: 799px) {
		button-row {
			flex-direction: column;
		}
	}
</style>
