<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import io from 'socket.io-client';
	import QRCode from 'qrcode';
	import clone from 'just-clone';
	import Info from '$lib/icons/Info.svelte';
	import Close from '$lib/icons/Close.svelte';
	import DOMPurify from 'dompurify';
	import formatTime from '$lib/functions/formatTime.js';

	import sendBoost from '$lib/functions/sendBoost';
	import throwConfetti from '$lib/functions/throwConfetti';
	import Modal from '$lib/Modal/Modal.svelte';

	import {
		user,
		albyClientId,
		remoteServer,
		liveMode,
		liveEnclosure,
		defaultBlockGuid
	} from '$/stores';
	export let isQR;
	let boostagram = '';
	let showInfoModal = false;
	let amount = 1;
	let btcPrice = 250000;
	let showModal = false;
	let senderName = 'anonymous';
	let activeBlock = {};

	let block;
	let isDefault = true;
	let loaded = false;
	const guid = $page.params.guid;
	let defaultBlock;
	let timeRemaining = null;
	let countdownInterval = null;

	let qrCodeCanvas;
	let code = '';

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

	onMount(async () => {
		console.log(remoteServer);
		const url = remoteServer + '/event?event_id=' + $page.params.guid;
		const liveItemSocket = io.connect(url);
		fetchConversionRate();
		senderName = localStorage.getItem('senderName') || 'anonymous';

		liveItemSocket.on('remoteValue', function (data) {
			// You will need to adjust this part based on the actual format of the data sent by the server

			console.log(data);
			if (data.timeRemaining) {
				syncTimeRemaining(data.timeRemaining); // Sync with WebSocket time
			} else {
				timeRemaining = 0;
			}
			block = data;
			isDefault = false;

			if (!Object?.keys(block)?.length) {
				block = defaultBlock;
			}

			if (block?.blockGuid && defaultBlock?.blockGuid) {
				isDefault = block?.blockGuid === defaultBlock?.blockGuid;
			}

			code = `${$page.url.origin}/promotion/${guid}/${block?.blockGuid}`;
			generateQRCode();
		});
		liveItemSocket.on('playerPause', function (data) {
			// You will need to adjust this part based on the actual format of the data sent by the server
			console.log(data);
		});
		loaded = true;
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();

		$liveMode = data?.settings?.broadcastMode;
		$liveEnclosure = data?.settings?.liveEnclosure;
		defaultBlock = data.blocks.find((v) => v?.settings?.default);
		if (!block) {
			if ($liveMode === 'podcast' || $liveMode === 'playlist') {
				block = defaultBlock;
			}
		}
		if (block?.blockGuid && defaultBlock?.blockGuid) {
			isDefault = block?.blockGuid === defaultBlock?.blockGuid;
		}
	});

	async function fetchConversionRate() {
		let res = await fetch('https://blockchain.info/tobtc?currency=USD&value=10000');

		btcPrice = await res.text();
	}

	function satsToDollars(satAmount) {
		let dollars = btcPrice * 10000;
		let amount = Math.round((satAmount / dollars) * 100) / 100;
		amount = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		return amount;
	}

	async function handleBoost() {
		console.log('isDefaultBoost: ', isDefault);
		sendBoost({ block: activeBlock, satAmount: amount, boostagram, senderName, isDefault })
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});

		throwConfetti();
		localStorage.setItem('senderName', senderName);
		$user.balance -= amount;
	}

	$: console.log(senderName);

	function handleKeyDown(event) {
		const keyValue = event.key;
		if (keyValue === '.' || keyValue === 'e' || keyValue === 'E') {
			event.preventDefault();
		}
	}

	function enforceMinMax(event) {
		let value = parseInt(event.target.value, 10) || 1;
		if (value <= 1) {
			amount = 1;
		} else if (value > Math.floor(Math.min($user.balance * 0.99, 5000000))) {
			amount = Math.floor(Math.min($user.balance * 0.99, 5000000));
		} else {
			amount = value;
		}
	}

	function setAmount(value) {
		amount = value;
	}
	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	function closeInfoModal() {
		showInfoModal = false;
	}

	function getTitle(block) {
		return getText(block?.title || block?.feedTitle || '');
	}

	function getLine0(block) {
		return getText(block?.line?.[0] || block?.itemTitle || '');
	}

	function getLine1(block) {
		return getText(block?.line?.[1] || block?.author || '');
	}

	function getText(text) {
		text =
			text === 'undefined' || text === 'Title - click to edit' || text === 'Text - click to edit'
				? ''
				: text;
		return DOMPurify.sanitize(text?.replace(/\r?\n/g, '<br/>'));
	}

	function getHeaderTitle(block) {
		return block?.title || block?.feedTitle || 'The Split Kit';
	}

	function syncTimeRemaining(newTime) {
		// Sync timeRemaining with the WebSocket time
		timeRemaining = newTime;

		// Clear any existing countdown
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}

		// Start a new countdown if timeRemaining is greater than 0
		if (timeRemaining > 0) {
			countdownInterval = setInterval(() => {
				timeRemaining -= 1;
				if (timeRemaining <= 0) {
					timeRemaining = 0;
					clearInterval(countdownInterval); // Stop the countdown
				}
			}, 1000); // Decrement every second
		}
	}
</script>

<svelte:head>
	<title>{`${getHeaderTitle(block)}`}</title>
</svelte:head>

{#if loaded}
	<container>
		<h1>{@html `${getTitle(block)}`}</h1>
		<image-container>
			<img
				class="image"
				src={block?.image || block?.artwork || '/splitkit300.png'}
				alt="live artwork"
				width="300"
				height="300"
			/>
			{#if Object.keys(block || {})?.length === 0}
				<h2>Standby for your host</h2>
			{/if}
			{#if block?.description}
				<button
					on:click={() => {
						showInfoModal = true;
					}}
					class="info"
				>
					<white-background />
					<Info size="32" />
				</button>
			{/if}
		</image-container>

		<h2>{@html `${getLine0(block)}`}</h2>
		<h3>{@html `${getLine1(block)}`}</h3>
		{#if block?.link?.url}
			<a href={block.link.url} target="_blank" rel="noopener noreferrer">
				{block?.link?.text || block?.link?.url}</a
			>
		{:else}
			<spacer />
		{/if}
		{#if timeRemaining}
			<p>Time Remaining: {formatTime(Math.round(timeRemaining), true)}</p>
		{/if}

		{#if isQR}
			<canvas bind:this={qrCodeCanvas} />
		{:else}
			<button
				class="boost"
				on:click={() => {
					if ($user.loggedIn) {
						showModal = true;
						activeBlock = clone(block);
					} else {
						console.log(redirectUrl);
						goto(redirectUrl);
					}
				}}>Boost 🚀</button
			>
		{/if}
	</container>
{/if}

{#if showModal}
	<Modal bind:showModal>
		<boost-container>
			<h2>{activeBlock.title}</h2>
			<label>
				Your Name
				<input type="text" bind:value={senderName} />
			</label>
			<textarea bind:value={boostagram} rows="4" placeholder="Enter your message here..." />
			<balance-text>
				<h3>Balance:</h3>
				<p>{$user.balance || 0} sats</p>
			</balance-text>
			<amount-text>
				<h3>Amount</h3>
				<p>between 1 and {Math.floor(Math.min($user.balance * 0.99, 5000000))}</p>
			</amount-text>
			<amount-container>
				<input
					class="amount"
					type="number"
					bind:value={amount}
					step="1"
					min="1"
					max="5000000"
					on:keydown={handleKeyDown}
					on:blur={enforceMinMax}
				/>
				<p class="sats">{amount > 1 ? 'sats' : 'sat'}</p>
				<p class="conversion">~${satsToDollars(amount)}</p>
			</amount-container>
			<btn-container>
				<button on:click={() => setAmount(1000)}>1k</button>
				<button on:click={() => setAmount(5000)}>5k</button>
				<button on:click={() => setAmount(10000)}>10k</button>
				<button on:click={() => setAmount(25000)}>25k</button>
			</btn-container>
			<button class="boost" on:click={handleBoost}>Boost 🚀</button>
		</boost-container>
	</Modal>
{/if}

{#if showInfoModal}
	<blurred-background
		class="info"
		on:mousedown|self={closeInfoModal}
		on:touchend|self={closeInfoModal}
	>
		<info-modal>
			<button class="close icon" on:click={closeInfoModal}>
				<Close size="24" />
			</button>
			<h2>Notes</h2>
			<notes>
				{@html DOMPurify.sanitize(block.description?.replace(/\r?\n/g, '<br/>'))}
			</notes>
			<!-- <textarea value={block.description} readonly /> -->
		</info-modal>
	</blurred-background>
{/if}

<style>
	:global(body) {
		background-color: #121212;
		color: #e0e0e0;
		font-family: Arial, sans-serif;
		margin: 0;
		padding: 0;
	}

	container {
		max-width: 450px;
		min-width: 300px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	h1,
	h2,
	h3,
	p,
	a {
		color: #ffffff;
	}

	img {
		width: 300px;
	}

	button {
		background-color: #1e88e5;
		color: #ffffff;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		border-radius: 4px;
	}

	button:hover {
		background-color: #1565c0;
	}

	button.info {
		background-color: transparent;
		border: 1px solid #ffffff;
		color: #ffffff;
	}

	button.close {
		background-color: #e53935;
		color: #ffffff;
	}

	Modal {
		background: #212121;
		color: #e0e0e0;
	}
</style>
