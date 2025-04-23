<script>
	import { onMount } from 'svelte';
	import Modal from '$lib/Modal/Modal.svelte';

	import { user } from '$/stores';

	export let showModal;
	export let activeBlock;

	import sendBoost from '$lib/functions/sendBoost';
	import throwConfetti from '$lib/functions/throwConfetti';

	let showInfoModal = false;
	let senderName = 'anonymous';
	let boostagram = '';
	let fromIndex = true;
	let amount = 1;
	let btcPrice = 250000;

	onMount(() => {
		fetchConversionRate();
		senderName = localStorage.getItem('senderName') || 'anonymous';
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
		sendBoost({ block: activeBlock, satAmount: amount, boostagram, senderName, fromIndex })
			.then((data) => {
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
			});

		throwConfetti();
		console.log('Boost button pressed');
		localStorage.setItem('senderName', senderName);
		boostagram = '';
		showModal = false;
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

	function closeInfoModal() {
		showInfoModal = false;
	}
</script>

<Modal bind:showModal dark>
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

<style>
	h2 {
		text-align: center;
		margin-top: 4px;
		min-height: 1.5em;
		width: 100%;
	}
	h3 {
		text-align: center;
		margin-top: 0;
		min-height: 1.5em;
		width: 100%;
	}

	p {
		text-align: center;
	}

	boost-container {
		width: calc(100% - 16px);
		margin: 0 8px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	boost-container h2 {
		margin: 0;
	}

	boost-container textarea {
		width: calc(100% - 8px);
		resize: none;
		margin: 8px 0;
		height: 200px;
		padding: 4px;
		flex: 1;
	}

	balance-text {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
	}

	balance-text h3,
	amount-text h3 {
		margin: 0 8px 0 0;
		min-height: 1em;
		width: initial;
	}

	balance-text p,
	amount-text p {
		margin: 0;
		text-align: right;
		width: inital;
		min-height: 1em;
	}

	amount-text {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}

	amount-text p,
	amount-text h3 {
		margin: 0;
		padding: 0;
	}

	amount-container {
		width: 100%;
		display: block;
		position: relative;
		margin-bottom: 8px;
	}
	.amount {
		width: calc(100% - 16px);
		padding: 0 8px 20px 8px;
	}

	amount-container p {
		position: absolute;
		top: 6px;
		padding: 0 8px;
		font-size: 0.9em;
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
	}

	button {
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
	}

	.boost {
		width: calc(100% - 16px);
		background-color: #ff6680;
		color: white;
		font-weight: 600;
		margin: 8px 0 16px 0;
	}

	textarea {
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		min-height: calc(50% - 32px);
		resize: none;
		margin: 8px 0;
		padding: 4px;
		border: 1px solid black;
	}

	boost-container {
		width: calc(100% - 16px);
		margin: 0 8px;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: #e0e0e0;
	}

	boost-container h2 {
		margin: 0;
	}

	boost-container textarea {
		width: calc(100% - 8px);
		resize: none;
		margin: 8px 0;
		height: 200px;
		padding: 4px;
		flex: 1;
	}

	balance-text {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
	}

	balance-text h3,
	amount-text h3 {
		margin: 0 8px 0 0;
		min-height: 1em;
		width: initial;
	}

	balance-text p,
	amount-text p {
		margin: 0;
		text-align: right;
		width: inital;
		min-height: 1em;
	}

	amount-text {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: flex-end;
	}

	amount-text p,
	amount-text h3 {
		margin: 0;
		padding: 0;
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
	}

	amount-container p {
		position: absolute;
		top: 6px;
		padding: 0 8px;
		font-size: 0.9em;
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

	label {
		align-self: flex-start;
		display: flex;
		flex-direction: column;
	}

	button {
		background-color: rgb(0, 231, 255);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 8px 0;
		height: 50px;
		box-shadow: none;
		border: none;
	}

	.boost {
		width: calc(100% - 16px);
		background-color: rgb(248, 0, 255);
		color: white;
		font-weight: 600;
		margin: 8px 0 16px 0;
		box-shadow: none;
	}

	textarea {
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		resize: none;
		margin: 8px 0;
		padding: 4px;
		background-color: #2a2a2a;
		border: none;

		color: #e0e0e0;
		outline: 1px solid #e0e0e0;
	}

	input {
		background-color: #2a2a2a;
		border: none;
		color: #e0e0e0;
		outline: 1px solid #e0e0e0;
		padding: 2px;
	}

	textarea,
	input {
		font-size: 16px;
	}
</style>
