<script>
	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import QR from './QR.svelte';

	import { user, remoteServer } from '$/stores';

	export let showModal;
	export let broadcastingBlock;
	export let paymentType;
	export let isMobile;
	export let throwConfetti;

	import sendBoost from '$lib/functions/sendBoost';

	let senderName = 'anonymous';
	let boostagram = '';
	let fromIndex = true;
	let amount = 1;
	let btcPrice = 250000;
	let showQR = false;
	let invoice;
	let activeScreen = 'boost';
	$: console.log(broadcastingBlock);

	onMount(() => {
		fetchConversionRate();
		senderName = localStorage.getItem('senderName') || 'anonymous';

		const url = remoteServer + '/event?event_id=' + broadcastingBlock.eventGuid;
		const socket = io.connect(url);

		socket.on('connect', () => {
			console.log(broadcastingBlock.eventGuid);
			console.log('Connected with clientId:', socket.id);
		});

		socket.on('invoiceVerify', function (data) {
			console.log('dude');
			console.log(data);

			if (invoice === data) {
				throwConfetti(amount);
				boostagram = '';
				showQR = false;
				showModal = false;
			}
		});

		// return cleanup function
		return () => {
			socket.disconnect();
		};
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
		// throwConfetti(amount);
		// showModal = false;
		// return;
		if (paymentType === 'qr') {
			localStorage.setItem('senderName', senderName);
			console.log(broadcastingBlock);
			let fountainName = senderName ? `${senderName} - ` : '';
			let fountainGram = `${fountainName}${boostagram}`;
			console.log(
				`https://api.fountain.fm/v1/lnurlp/sobig/pay?amount=${
					amount * 1000
				}&comment=${fountainGram}}`
			);
			// let res = await fetch(
			// 	`https://thesplitbox.com/lnurlp/tsk-${broadcastingBlock.eventGuid}/callback?amount=${
			// 		amount * 1000
			// 	}&comment=${boostagram}&senderName=${senderName}&blockGuid=${broadcastingBlock.blockGuid}`
			// );

			let res = await fetch(
				`https://api.fountain.fm/v1/lnurlp/sobig/pay?amount=${
					amount * 1000
				}&comment=${fountainGram}}`
			);
			let data = await res.json();
			invoice = data.pr;
			showQR = true;
			console.log(data);
		} else if ($user.loggedIn) {
			sendBoost({ block: broadcastingBlock, satAmount: amount, boostagram, senderName, fromIndex })
				.then((data) => {
					console.log(data);
				})
				.catch((err) => {
					console.log(err);
				});

			throwConfetti(amount);
			console.log('Boost button pressed');
			localStorage.setItem('senderName', senderName);
			boostagram = '';
			showModal = false;
			$user.balance -= amount;
		}
	}

	$: console.log(broadcastingBlock);

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

	$: console.log(activeScreen);
</script>

<Modal bind:showModal>
	<boost-container>
		<h2>{broadcastingBlock.title}</h2>

		{#if isMobile}
			<div class="screen-select">
				<button
					on:click={() => {
						activeScreen = 'boost';
					}}
					class:active={activeScreen === 'boost'}
				>
					Boostagram
				</button>
				<button
					on:click={() => {
						activeScreen = 'splits';
					}}
					class:active={activeScreen === 'splits'}
				>
					Splits
				</button>
			</div>
		{/if}
		<panels class:mobile={isMobile}>
			<left class:hide={isMobile && activeScreen === 'splits'} class:fullwidth={isMobile}>
				{#if $user.loggedIn}
					<balance-text>
						<h3>Balance:</h3>
						<p>{$user.balance || 0} sats</p>
					</balance-text>
				{/if}
				<label>
					<input type="text" bind:value={senderName} placeholder="Enter your name here..." />
				</label>
				<textarea bind:value={boostagram} rows="4" placeholder="Enter your message here..." />
				<amount-text>
					<h3>Amount</h3>
					{#if $user.loggedIn}
						<p>between 1 and {Math.floor(Math.min($user.balance * 0.99, 5000000))}</p>
					{/if}
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
			</left>
			<right class:hide={isMobile && activeScreen === 'boost'} class:fullwidth={isMobile}>
				<header>
					<p>Name</p>
					<p>Split</p>
				</header>
				<ul>
					{#each broadcastingBlock.value.destinations || [] as person}
						<li>
							<p>{person.name}</p>
							<p>{person.split}</p>
						</li>
					{/each}
				</ul>
			</right>
		</panels>
		<btn-container class:hide={isMobile && activeScreen === 'splits'}>
			<button on:click={() => setAmount(1000)}>1,000</button>
			<button on:click={() => setAmount(5000)}>5,000</button>
			<button on:click={() => setAmount(10000)}>10,000</button>
			<button on:click={() => setAmount(25000)}>25,000</button>
		</btn-container>
		<button class:hide={isMobile && activeScreen === 'splits'} class="boost" on:click={handleBoost}>
			Boost
		</button>
	</boost-container>
</Modal>

{#if showQR}
	<Modal bind:showModal={showQR} backgroundColor="rgb(0,0,0)" width="300px" height="300px">
		<div class="qr-container">
			<div class="qr">
				<QR code={invoice} />
			</div>
		</div>
	</Modal>
{/if}

<style>
	boost-container {
		width: calc(100% - 16px);
		margin: 0 8px;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: white;
	}
	boost-container h2 {
		margin: 0;
		text-align: center;
		margin-top: 4px;
		min-height: 1.5em;
		width: 100%;
		font-size: 3em;
	}
	h3 {
		text-align: center;
		margin-top: 0;
		width: 100%;
	}
	p {
		text-align: center;
		font-weight: 600;
		color: white;
		font-size: 1em;
	}
	panels {
		display: flex;
		width: 100%;
		justify-content: space-between;
		height: calc(100% - 204px);
		flex: 1;
	}
	left,
	right {
		display: flex;
		width: calc(50% - 8px);
		margin-bottom: 8px;
		flex-direction: column;
	}

	header {
		display: flex;
		justify-content: space-between;
		margin: 0 8px;
	}
	header > p {
		margin: 0;
		padding: 0;
		text-decoration: underline;
	}
	ul {
		padding: 8px;
		height: calc(100% - 32px);
		overflow: auto;
		margin: 0;
	}
	li {
		list-style: none;
		padding: 0 8px;
		display: flex;
		justify-content: space-between;
	}
	li > p {
		padding: 0;
		margin: 4px 0;
	}
	boost-container textarea {
		width: calc(100% - 8px);
		resize: none;
		margin: 8px 0;
		height: 200px;
		padding: 4px;
		flex: 1;
		background-color: transparent;
		border: none;
		color: white;
		outline: 1px solid white;
		font-size: 16px;
		font-weight: 600;
	}
	boost-container textarea::placeholder {
		font-weight: 600;
	}
	balance-text,
	amount-text {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}
	balance-text h3,
	amount-text h3 {
		margin: 0;
		min-height: 1em;
		width: initial;
	}
	balance-text p,
	amount-text p {
		margin: 0;
		text-align: right;
		width: initial;
		min-height: 1em;
		color: white;
	}

	balance-text {
		justify-content: center;
		font-size: 1.5em;
	}

	balance-text > p {
		margin-left: 8px;
	}

	amount-container {
		width: 100%;
		display: block;
		position: relative;
		margin-bottom: 8px;
	}
	.amount {
		width: calc(100% - 16px);
		padding: 2px 8px 20px 8px;
		font-size: 1.3em;
	}
	amount-container p {
		position: absolute;
		top: 4px;
		padding: 0 8px;
	}
	amount-container .sats {
		left: 0;
	}
	amount-container .conversion {
		right: 0;
	}
	btn-container {
		display: flex;
		justify-content: space-around;
		width: 100%;
	}
	btn-container button {
		width: 20%;
	}

	button {
		background-color: hsl(2, 35%, 52%);
		background-color: hsl(195, 94%, 75%);
		color: hsl(195, 100%, 25%);
		padding: 4px 12px;
		border: none;
		border-radius: 25px;
		font-size: 1.2em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
		box-shadow: none;
	}

	.boost {
		width: calc(100% - 16px);
		background-color: hsl(0, 52%, 39%);
		background-color: hsl(195, 94%, 50%);
		color: hsl(195, 100%, 10%);
		font-weight: 600;
		margin: 8px 0 16px 0;
		box-shadow: none;
		font-size: 1.6em;
	}

	.boost:disabled {
		width: calc(100% - 16px);

		background-color: hsl(195, 94%, 95%);
		color: hsl(195, 100%, 15%);
	}
	input,
	textarea {
		background-color: transparent;
		border: none;
		color: white;
		outline: 1px solid white;
		padding: 2px;
		font-weight: 600;
		font-size: 16px;
	}
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}
	label {
		display: flex;
		flex-direction: column;
		font-weight: 600;
	}

	.qr-container {
		width: 100%;
		height: calc(100%);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		top: -30px;
	}

	.qr {
		width: 260px;
		height: 260px;
	}

	.screen-select {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		height: 50px;
	}

	.screen-select > button {
		width: 108px;
		height: auto;
		padding: 0;
		border-radius: 0;
		background-color: transparent;
		color: white;
	}

	.screen-select > button.active {
		border-bottom: 2px solid white;
	}

	.fullwidth {
		width: 100%;
	}

	.hide {
		display: none;
	}
</style>
