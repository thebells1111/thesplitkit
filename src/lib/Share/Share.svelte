<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { saveAs } from 'file-saver';
	import { page } from '$app/stores';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import Modal from '$lib/Modal/Modal.svelte';

	export let liveGuid;
	export let eventGuid;
	export let blockGuid;
	let guid;
	let code = '';
	let podcastCode = '';
	let showPodcastModal = false;

	if (liveGuid) {
		guid = liveGuid;
		code = `${$page.url.origin}/live/${liveGuid}`;
		podcastCode = `https://curiohoster.com/event?event_id=${liveGuid}`;
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

		<copy-link-row>
			<input type="url" disabled value={code} />
			<button class="dl-link" on:click={copyLinkToClipboard}>
				<copy-link-icon>
					<CopyIcon size="32" />
					<link-icon>
						<LinkIcon />
					</link-icon>
				</copy-link-icon>
			</button>
		</copy-link-row>
		<!-- <button class="dl-link" on:click={() => (showButtonModal = true)}
			>Create Embeddable Button</button
		> -->
		<input type="file" bind:this={fileInput} webkitdirectory />
		<button class="podcast-link" on:click={() => (showPodcastModal = true)}
			>Get Podcast Link
		</button>
	</div>
{/if}

{#if showPodcastModal}
	<Modal bind:showModal={showPodcastModal}>
		<podcast-code>
			<h2>
				Copy the tag below and paste into the {`<podcast:liveItem>`}
				of your podcast feed
			</h2>

			<code-block>
				<code>
					{`<podcast:liveValue uri="${podcastCode}" protocol="socket.io"/>`}
				</code>
			</code-block>

			<h2>or copy the link below in your Sovereign Feeds Live Value Link</h2>
			<code-block>
				<code>
					{`${podcastCode}`}
				</code>
			</code-block>
		</podcast-code>
	</Modal>
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

	copy-link-row {
		display: flex;
		align-items: center;
		width: calc(100%);
	}
	input[type='url'] {
		padding: 8px;
		height: 1em;
		flex: 1;
		margin-right: 4px;
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
		position: relative;
	}

	.dl-qr {
		background-color: rgb(0, 132, 180);
	}

	.dl-link {
		background-color: rgb(105, 0, 180);
		width: 50px;
		height: 50px;
		border-radius: 50px;
		margin: 0;
	}

	link-icon {
		background-color: rgb(105, 0, 180);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 15px;
		position: absolute;
		bottom: 4px;
		right: 4px;
	}

	.podcast-link {
		background-color: rgb(180, 0, 153);
	}

	h2 {
		text-align: center;
	}

	podcast-code {
		margin: 8px;
	}

	code-block {
		display: block;
		background-color: rgb(245, 245, 245);
		color: black;
		padding: 10px;
		border-radius: 5px;
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	@media (max-width: 799px) {
		button-row {
			flex-direction: column;
		}
	}
</style>
