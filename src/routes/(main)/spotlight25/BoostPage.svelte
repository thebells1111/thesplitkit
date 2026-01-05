<script>
	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import QR from './QR.svelte';

	import { user, remoteServer } from '$/stores';

	export let showModal;
	export let activeBlock;
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

	onMount(() => {
		fetchConversionRate();
		senderName = localStorage.getItem('senderName') || 'anonymous';

		const url = remoteServer + '/event?event_id=' + activeBlock.eventGuid;
		const socket = io.connect(url);

		socket.on('connect', () => {
			console.log(activeBlock.eventGuid);
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
			console.log(activeBlock);
			let res = await fetch(
				`https://thesplitbox.com/lnurlp/tsk-${activeBlock.eventGuid}/callback?amount=${
					amount * 1000
				}&comment=${boostagram}&senderName=${senderName}&blockGuid=${activeBlock.blockGuid}`
			);
			let data = await res.json();
			invoice = data.pr;
			showQR = true;
			console.log(data);
		} else if ($user.loggedIn) {
			sendBoost({ block: activeBlock, satAmount: amount, boostagram, senderName, fromIndex })
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

	$: console.log(activeBlock.value.destinations);

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

<Modal bind:showModal imgSrc="./main-bg.png">
	<boost-container>
		<h2>{activeBlock.title}</h2>

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
		<panels>
			<left class:hide={isMobile && activeScreen === 'splits'} class:fullwidth={isMobile}>
				{#if $user.loggedIn}
					<balance-text>
						<h3>Balance:</h3>
						<p>{$user.balance || 0} sats</p>
					</balance-text>
				{/if}
				<label>
					Your Name
					<input type="text" bind:value={senderName} />
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
					{#each activeBlock.value.destinations || [] as person}
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
	<Modal bind:showModal={showQR} backgroundColor="rgb(223,206,200)" width="300px" height="300px">
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
		color: #222;
		font-family: 'Berkshire';
	}
	boost-container h2 {
		margin: 0;
		text-align: center;
		margin-top: 4px;
		min-height: 1.5em;
		width: 100%;
		font-size: 3em;
		font-family: 'FleurDeLeah', cursive;
	}
	h3 {
		text-align: center;
		margin-top: 0;
		width: 100%;
	}
	p {
		text-align: center;
		font-weight: 600;
		color: #222;
		font-size: 1em;
	}
	panels {
		display: flex;
		width: 100%;
		justify-content: space-between;
		height: calc(100% - 204px);
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
		color: #222;
		outline: 1px solid #222;
		font-size: 16px;
		font-weight: 600;
	}
	boost-container textarea::placeholder {
		font-weight: 600;
		color: #222;
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
		color: #222;
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
		color: rgb(233, 225, 229);
		padding: 4px 12px;
		border: none;
		border-radius: 25px;
		font-size: 1.2em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
		box-shadow: none;
		font-family: 'Berkshire';
	}

	.boost {
		width: calc(100% - 16px);
		background-color: hsl(0, 52%, 39%);
		color: rgb(233, 225, 229);
		font-weight: 600;
		margin: 8px 0 16px 0;
		box-shadow: none;
		font-family: WindSongBold;
		font-size: 1.6em;
	}

	.boost:disabled {
		width: calc(100% - 16px);
		background-color: hsl(0, 52%, 59%);
	}
	input,
	textarea {
		background-color: transparent;
		border: none;
		color: #222;
		outline: 1px solid #222;
		padding: 2px;
		font-weight: 600;
		font-family: 'Berkshire';
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
		align-self: flex-start;
		display: flex;
		flex-direction: column;
		font-weight: 600;
		font-size: 1.5em;
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
	}

	.screen-select > button {
		width: 108px;
		height: auto;
		padding: 0;
		border-radius: 0;
		background-color: transparent;
		color: #222;
	}

	.screen-select > button.active {
		border-bottom: 2px solid #222;
	}

	.fullwidth {
		width: 100%;
	}

	.hide {
		display: none;
	}
</style>
