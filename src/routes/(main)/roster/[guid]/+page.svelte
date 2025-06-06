<script>
	import Card from './Card.svelte';
	import { page } from '$app/stores';

	import { remoteServer, liveBlocks, activePageGuid, user } from '$/stores';

	import sendBoost from '$lib/functions/sendBoost';
	import throwConfetti from '$lib/functions/throwConfetti';
	import Modal from '$lib/Modal/Modal.svelte';

	const guid = $page.params.guid;
	$activePageGuid = guid;
	let boostagram = '';
	let showInfoModal = false;
	let fromIndex = true;
	let amount = 1;
	let btcPrice = 250000;
	let showModal = false;
	let senderName = 'anonymous';
	let activeBlock = {};
	$: console.log($user);
	onMount(() => {
		loadBlocks();
		fetchConversionRate();
		senderName = localStorage.getItem('senderName') || 'anonymous';
	});

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
			console.log($liveBlocks);
		}
	}

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

<div class="grid-container">
	{#each $liveBlocks as block}
		{#if block}
			<Card {block} bind:showModal bind:activeBlock />
		{/if}
	{/each}
</div>

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

<style>
	.grid-container {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-wrap: wrap;
	}

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

	image-container {
		display: block;
		position: relative;
	}
	white-background {
		display: block;
		position: absolute;
		background-color: white;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		z-index: -1;
	}
	image-container button.info {
		position: absolute;
		bottom: -4px;
		right: 4px;
		width: initial;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background-color: transparent;
		color: hsl(283, 99%, 49%);
		box-shadow: none;
		filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
	}

	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}
	info-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
	}

	info-modal textarea {
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		resize: none;
		margin: 8px 0;
		padding: 4px;
		border: none;
		outline: none;
	}

	info-modal h2 {
		margin: 16px 0 8px 0;
		height: initial;
		min-height: initial;
	}

	textarea {
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		resize: none;
		margin: 8px 0;
		padding: 4px;
		border: 1px solid black;
	}

	button.close {
		position: absolute;
		top: -4px;
		right: -4px;
		background-color: transparent;
		padding: 8px;
		color: rgba(0, 0, 0, 0.75);
		z-index: 33;
		border: 1px solid transparent;
		width: initial;
		margin: 0;
		height: initial;
	}

	@media screen and (max-width: 992px) {
	}
</style>
