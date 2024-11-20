<script>
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { saveAs } from 'file-saver';
	import { page } from '$app/stores';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import BitcoinIcon from '$lib/icons/Bitcoin.svelte';
	import ShareIcon from '$lib/icons/Share.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PublishIcon from '$lib/icons/Publish.svelte';
	import QRIcon from '$lib/icons/QRReader.svelte';
	import DownloadIcon from '$lib/icons/Download.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import RemoteValue from '$routes/(main)/remotevalue/[guid]/+page.svelte';
	import DownloadChapters from '$routes/(main)/chapters/[guid]/+page.svelte';
	import ShowNotes from './ShowNotes.svelte';
	import CreateFeed from '$lib/CreateFeed/CreateFeed.svelte';
	import PublisherPrompt from '$lib/CreateFeed/PublisherPrompt.svelte';

	export let liveGuid;
	export let eventGuid;
	export let blockGuid;
	export let shareEvent = false;
	export let promotion = false;
	let guid;
	let code = '';
	let podcastCode = '';
	let showPodcastModal = false;
	let showRemoteValuesModal = false;
	let showDownloadChaptersModal = false;
	let showShowNotesModal = false;
	let showImportModal = false;
	let showFeedModal = false;
	let showDownloadFeed = false;
	let publisherFeedType = false;

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
				width: 200
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

	function copyLinkToClipboard(text) {
		navigator.clipboard.writeText(text);
		alert('Copied Link to clipboard');
	}
</script>

{#if guid}
	<div class="qr-container">
		<canvas bind:this={qrCodeCanvas} />
		<button-row class="top">
			<button-container>
				<button class="copy-qr" on:click={copyQRToClipboard}>
					<multi-icon>
						<QRIcon size="32" />
						<secondary-icon class="copy-qr">
							<CopyIcon />
						</secondary-icon>
					</multi-icon>
				</button>
				<p>Copy <br />QR Code</p>
			</button-container>
			<button-container>
				<button class="dl-qr" on:click={saveQRCode}>
					<multi-icon>
						<QRIcon size="32" />
						<secondary-icon class="dl-qr">
							<DownloadIcon />
						</secondary-icon>
					</multi-icon>
				</button>
				<p>Download <br />QR Code</p>
			</button-container>
		</button-row>

		<copy-link-row>
			<h3>Sharable Link to View Your {promotion ? 'Block' : 'Event'}</h3>
			<div>
				<input type="url" disabled value={code} />
				<button class="dl-link" on:click={copyLinkToClipboard.bind(this, code)}>
					<copy-link-icon class="multi-icon">
						<CopyIcon size="32" />
						<secondary-icon class="dl-link">
							<LinkIcon />
						</secondary-icon>
					</copy-link-icon>
				</button>
			</div>
		</copy-link-row>
		<!-- <button class="dl-link" on:click={() => (showButtonModal = true)}
			>Create Embeddable Button</button
		> -->

		<input type="file" bind:this={fileInput} webkitdirectory />

		<spacer />
		{#if shareEvent}
			<h3>Enhance Your Podcast</h3>
			<button-row>
				<button-container>
					<button class="value-time-splits" on:click={() => (showRemoteValuesModal = true)}>
						<multi-icon>
							<BitcoinIcon size="36" />
							<secondary-icon class="value-time-splits">
								<ShareIcon />
							</secondary-icon>
						</multi-icon>
					</button>
					<p>Value <br />Time Splits</p>
				</button-container>
				<button-container>
					<button class="show-notes" on:click={() => (showShowNotesModal = true)}>
						{`<HTML/>`}
					</button>
					<p>Show Notes</p>
				</button-container>
				<button-container>
					<button class="chapter-link" on:click={() => (showDownloadChaptersModal = true)}>
						<multi-icon>
							<ChapterIcon size="32" />
							<secondary-icon class="chapter-link">
								<DownloadIcon />
							</secondary-icon>
						</multi-icon>
					</button>
					<p>Download <br />Chapters</p>
				</button-container>
			</button-row><button-row>
				<button-container>
					<button class="podcast-link" on:click={() => (showPodcastModal = true)}>
						<multi-icon>
							<PodcastIcon size="32" />
							<secondary-icon class="podcast-link">
								<LinkIcon />
							</secondary-icon>
						</multi-icon>
					</button>
					<p>Live <br />Value Link</p>
				</button-container>
				<button-container>
					<button class="import-link" on:click={() => (showImportModal = true)}>
						<multi-icon>
							<PublishIcon size="32" />
							<secondary-icon class="import-link">
								<LinkIcon />
							</secondary-icon>
						</multi-icon>
					</button>
					<p>Import <br />ID</p>
				</button-container>
				<button-container>
					<button class="create-feed" on:click={() => (showFeedModal = true)}>XML</button>
					<p>Create <br />Feed</p>
				</button-container>
			</button-row>
		{/if}
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
				<button class="lvl-link" on:click={copyLinkToClipboard.bind(this, podcastCode)}>
					<copy-link-icon class="multi-icon">
						<CopyIcon size="32" />
					</copy-link-icon>
				</button>
			</code-block>

			<h2>or copy the link below in your <br />Sovereign Feeds<br /> Live Value Link</h2>
			<code-block>
				<code>
					{`${podcastCode}`}
				</code>
				<button class="lvl-link" on:click={copyLinkToClipboard.bind(this, podcastCode)}>
					<copy-link-icon class="multi-icon">
						<CopyIcon size="32" />
					</copy-link-icon>
				</button>
			</code-block>
		</podcast-code>
	</Modal>
{/if}

{#if showRemoteValuesModal}
	<Modal bind:showModal={showRemoteValuesModal}>
		<share-container>
			<RemoteValue />
		</share-container>
	</Modal>
{/if}

{#if showDownloadChaptersModal}
	<Modal bind:showModal={showDownloadChaptersModal}>
		<download-container>
			<DownloadChapters />
		</download-container>
	</Modal>
{/if}

{#if showShowNotesModal}
	<Modal bind:showModal={showShowNotesModal}>
		<share-container>
			<ShowNotes />
		</share-container>
	</Modal>
{/if}

{#if showImportModal}
	<Modal bind:showModal={showImportModal}>
		<podcast-code>
			<h2>Copy the link below to paste into your host's <br />"Import from the Split Kit".</h2>
			<code-block>
				<code>
					{`${liveGuid}`}
				</code>
				<button class="lvl-link" on:click={copyLinkToClipboard.bind(this, liveGuid)}>
					<copy-link-icon class="multi-icon">
						<CopyIcon size="32" />
					</copy-link-icon>
				</button>
			</code-block>
		</podcast-code>
	</Modal>
{/if}

{#if showFeedModal}
	<Modal
		bind:showModal={showFeedModal}
		isFeedDownload={true}
		closeModal={() => {
			showDownloadFeed = false;
			publisherFeedType = false;
		}}
	>
		{#if !publisherFeedType}
			<PublisherPrompt bind:publisherFeedType />
		{:else if showDownloadFeed || publisherFeedType}
			<CreateFeed bind:showFeedModal bind:publisherFeedType />
		{:else}
			<RemoteValue bind:showDownloadFeed isFeedDownload={true} />
		{/if}
	</Modal>
{/if}

<style>
	.qr-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: calc(100% - 16px);
		margin: 0 8px;
		height: 100%;
		position: relative;
		top: -58px;
	}
	button {
		margin: 1rem;
	}

	button-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		width: 100%;
		max-width: 420px;
		margin-bottom: 8px;
	}

	button-row.top {
		position: absolute;
		top: 170px;
		max-width: 360px;
	}

	input[type='file'] {
		display: none;
	}

	copy-link-row {
		margin: 60px 0 0 0;
		width: 100%;
	}

	h3 {
		margin: 0;
		text-align: center;
		color: var(--color-theme-blue);
	}

	copy-link-row div {
		display: flex;
		align-items: center;
		width: calc(100%);
		align-self: flex-start;
	}
	input[type='url'] {
		padding: 8px;
		height: 1em;
		flex: 1;
		margin-right: 4px;
	}

	button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 8px;
		width: 65px;
	}

	p {
		margin: 0;
		padding: 0;
		font-size: 0.8em;
		text-align: center;
	}

	button {
		font-weight: 700;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		width: 50px;
		height: 50px;
		border-radius: 50px;
		color: white;
		box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.5);
		position: relative;
		margin: 0;
		overflow: hidden;
	}

	.copy-qr,
	.value-time-splits,
	.podcast-link {
		background-color: var(--color-theme-yellow);
		color: var(--color-text-0);
	}

	.dl-qr,
	.show-notes,
	.import-link {
		color: hsl(278, 100%, 92%);
		background-color: hsl(277, 100%, 44%);
	}

	.create-feed,
	.dl-link,
	.chapter-link {
		background-color: var(--color-theme-blue);
	}

	.show-notes {
		font-size: 0.6em;
	}

	secondary-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 15px;
		position: absolute;
		bottom: 2px;
		right: 2px;
	}

	h2 {
		text-align: center;
	}

	podcast-code {
		display: block;
		margin: 80px 16px 0 16px;
		position: relative;
	}

	share-container {
		display: block;
		height: calc(100% - 16px);
		padding: 0 8px 16px 8px;
		overflow: auto;
	}

	download-container {
		display: block;
		height: calc(100%);
		overflow: auto;
	}

	code-block {
		display: block;
		background-color: rgb(245, 245, 245);
		color: black;
		padding: 10px;
		border-radius: 5px;
		white-space: pre-wrap;
		word-wrap: break-word;
		position: relative;
	}

	podcast-code h2 {
		color: rgb(166, 0, 0);
	}

	.lvl-link {
		position: absolute;
		right: 0;
		bottom: -4px;
	}

	spacer {
		height: 8px;
		flex: 1;
		max-height: 100px;
	}
</style>
