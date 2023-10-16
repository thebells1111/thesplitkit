<script>
	import { onMount } from 'svelte';
	import DataFields from './DataFields.svelte';
	import WalletProvidersQuery from './WalletProviderQuery.svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import clone from 'just-clone';
	import Add from '$icons/Add.svelte';

	export let data;
	export let feed;
	export let isItem;

	let totalPercentage = 0;

	const calculateTotalPercentage = () => {
		totalPercentage = data['podcast:value']['podcast:valueRecipient'].reduce((acc, person) => {
			let adder = 0;
			if (!person['@_fee']) {
				adder = parseFloat(person['@_split']) || 0;
			}
			return acc + adder;
		}, 0);

		return totalPercentage;
	};

	onMount(calculateTotalPercentage);

	export let unsaved = false;
	let showWalletModal = false;
	let editingIndex;

	let provider = '';

	let showProviderInput = false;

	function addPerson() {
		editingIndex = data['podcast:value']['podcast:valueRecipient'].length;
		data['podcast:value']['podcast:valueRecipient'] = [
			...data['podcast:value']['podcast:valueRecipient'],
			{ '@_split': '', '@_name': '', '@_address': '', '@_customKey': '', '@_customValue': '' }
		];
		showWalletModal = true;
	}

	function updatevalue(index, key, value) {
		if (typeof data['podcast:value']['podcast:valueRecipient'] !== 'array') {
			data['podcast:value']['podcast:valueRecipient'] = [
				...data['podcast:value']['podcast:valueRecipient']
			];
		}

		data['podcast:value']['podcast:valueRecipient'][index][key] = value;
		if (key === '@_split') {
			calculateTotalPercentage();
		}
		unsaved = true;
	}

	function closeWalletModal(e) {
		console.log(e);
		console.log('test');
		showWalletModal = false;
		e.stopPropagation();
		e.preventDefault();
	}

	function deletePerson(index) {
		if (typeof data['podcast:value']['podcast:valueRecipient'] !== 'array') {
			data['podcast:value']['podcast:valueRecipient'] = [
				...data['podcast:value']['podcast:valueRecipient']
			];
		}
		const personName = data['podcast:value']['podcast:valueRecipient'][index].name || 'this person';
		if (window.confirm(`Are you sure you want to delete ${personName}?`)) {
			data['podcast:value']['podcast:valueRecipient'] = data['podcast:value'][
				'podcast:valueRecipient'
			].filter((_, i) => i !== index);
			calculateTotalPercentage();
		}
	}

	function importFromFeed() {
		data['podcast:value'] = clone(feed['podcast:value']);
		const newPerson = {
			'@_name': 'The Split Kit',
			'@_customKey': '696969',
			'@_customValue': 'boPNspwDdt7axih5DfKs',
			'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
			'@_type': 'node',
			'@_split': String(splitKitSplit),
			'@_fee': true
		};
		data['podcast:value']['podcast:valueRecipient'].push(newPerson);
		data = data;
		calculateTotalPercentage();
	}

	let splitKitChecked = true;
	let splitKitSplit = 5;

	function toggleSplitKit(value) {
		const splitKitIndex = data['podcast:value']['podcast:valueRecipient'].findIndex(
			(e) => e['@_name'] === 'The Split Kit' && (e['@_fee'] === true || e['@_fee'] === 'true')
		);
		if (value && splitKitIndex === -1) {
			const newPerson = {
				'@_name': 'The Split Kit',
				'@_customKey': '696969',
				'@_customValue': 'boPNspwDdt7axih5DfKs',
				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
				'@_type': 'node',
				'@_split': String(splitKitSplit),
				'@_fee': true
			};
			data['podcast:value']['podcast:valueRecipient'].push(newPerson);
			data = data;
		} else if (!value && splitKitIndex !== -1) {
			data['podcast:value']['podcast:valueRecipient'].splice(splitKitIndex, 1);
			data = data;
		}
		calculateTotalPercentage();
		unsaved = true;
	}

	function adjustSplitKitSplit(value) {
		const splitKitIndex = data['podcast:value']['podcast:valueRecipient'].findIndex(
			(e) => e['@_name'] === 'The Split Kit' && (e['@_fee'] === true || e['@_fee'] === 'true')
		);
		if (splitKitIndex !== -1) {
			data['podcast:value']['podcast:valueRecipient'][splitKitIndex]['@_split'] = String(value);
			splitKitSplit = value;
			calculateTotalPercentage();
			unsaved = true;
		}
	}
</script>

<value-container>
	<value-header>
		<div class="warning">
			{totalPercentage !== 100 ? 'Warning: Total percentage must equal 100%' : ''}
		</div>
		<mobile-top>
			<h2>{isItem ? 'Episode' : 'Podcast'} Value Block</h2>
		</mobile-top>
		<total-percentage>
			Total Percentage: {totalPercentage || 0}%
		</total-percentage>
		{#if isItem}
			<button class="use-feed" on:click={importFromFeed}>Use Feeds Value Block</button>
		{/if}
		<add-container>
			<backer />
			<button class="add" on:click={addPerson}>
				<Add size="60" />
			</button>
		</add-container>
	</value-header>

	{#each [].concat(data?.['podcast:value']?.['podcast:valueRecipient']).filter((v) => {
		return v['@_customValue'] !== 'boPNspwDdt7axih5DfKs';
	}) || [] as person, index}
		<person
			on:click={() => {
				editingIndex = index;
				showWalletModal = true;
			}}
		>
			<info>
				<p style={['@_name'] ? '' : 'color:red'}>
					{person['@_name'] || 'a name is required for this person'}
				</p>
				<p class="percentage" style={person['@_split'] ? '' : 'color:red'}>
					{person['@_split'] || 0}% {person['@_fee'] ? '(fee)' : ''}
				</p>
			</info>
			<button on:click|stopPropagation={deletePerson.bind(this, index)}>
				<Delete size={24} />
			</button>
		</person>
	{/each}
</value-container>

{#if showWalletModal}
	<blurred-background
		on:click|self|stopPropagation={closeWalletModal}
		on:touchend|self|stopPropagation={closeWalletModal}
	>
		<wallet-modal>
			{#if showProviderInput}
				<WalletProvidersQuery
					bind:showProviderInput
					{provider}
					index={editingIndex}
					{updatevalue}
				/>
			{:else}
				<DataFields
					person={data['podcast:value']['podcast:valueRecipient'][editingIndex]}
					index={editingIndex}
					{updatevalue}
					bind:showProviderInput
					bind:provider
				/>
			{/if}
		</wallet-modal>
	</blurred-background>
{/if}

{#if isItem}
	<label>
		Include The Split Kit as a fee:
		<input
			type="checkbox"
			bind:checked={splitKitChecked}
			on:change={() => toggleSplitKit(splitKitChecked)}
		/>
	</label>
	{#if splitKitChecked}
		<label>
			Split for The Split Kit:
			<input
				type="number"
				bind:value={splitKitSplit}
				on:input={() => adjustSplitKitSplit(splitKitSplit)}
			/>
		</label>
	{/if}
{/if}

<style>
	value-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.warning {
		color: red;
		font-weight: bold;
		font-size: 0.9em;
		text-align: center;
		min-height: 32px;
		position: absolute;
		top: 10px;
	}

	value-header {
		display: flex;
		flex-direction: column;
		margin-top: 4px;
		align-items: center;
		justify-content: center;
		min-height: 34px;
	}

	mobile-top {
		display: flex;
		align-items: center;
	}

	value-header h2 {
		margin: 0;
		color: var(--color-theme-2);
	}

	value-header button {
		background-color: var(--color-theme-yellow);
		color: var(--color-text-0);
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 0 32px;
	}

	total-percentage {
		display: block;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 8px;
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
		z-index: 999;
		backdrop-filter: blur(5px);
	}

	wallet-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		width: calc(100% - 64px);
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
		padding: 8px;
	}

	person {
		width: 100%;
		display: flex;
		margin: 4px;
		align-items: center;
		border-bottom: 1px solid lightgray;
		padding-bottom: 4px;
		cursor: pointer;
	}

	person info {
		flex: 1;
	}

	person p {
		margin: 0;
	}

	person p.percentage {
		margin: 0 8px;
	}

	person button {
		color: red;
		background-color: transparent;
		box-shadow: none;
	}

	label {
		font-weight: 600;
	}

	label:nth-of-type(1) {
		margin-bottom: 8px;
	}

	label:nth-of-type(2) {
		margin-bottom: 16px;
	}

	input[type='number'] {
		padding: 4px;
		width: 64px;
	}

	.use-feed {
		margin-bottom: 8px;
	}
	add-container {
		background-color: red;
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		bottom: 80px;
		right: 36px;
	}

	.add {
		color: var(--color-theme-blue);
		background-color: transparent;
		padding: 0;
		box-shadow: none;
		position: absolute;
	}

	backer {
		display: block;
		position: absolute;
		background-color: var(--color-text-1);
		width: 50px;
		height: 50px;
		border-radius: 50px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	@media (max-width: 799px) {
		mobile-top {
			margin-bottom: 0.25em;
		}

		wallet-modal {
			width: calc(100% - 32px);
		}
	}
</style>
