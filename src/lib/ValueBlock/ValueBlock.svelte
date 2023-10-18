<script>
	import DataFields from './DataFields.svelte';
	import WalletProvidersQuery from './WalletProviderQuery.svelte';
	import Delete from '$lib/icons/Delete.svelte';

	export let data = {};
	export let calculateTotalPercentage = () => {};
	export let unsaved = false;
	let showWalletModal = false;
	let editingIndex;

	let provider = '';

	let showProviderInput = false;

	function addPerson() {
		editingIndex = data.value.destinations.length;
		data.value.destinations = [
			...data.value.destinations,
			{ name: '', address: '', type: 'node', customKey: '', customValue: '', split: '' }
		];
		showWalletModal = true;
	}

	function updatevalue(index, key, value) {
		data.value.destinations[index][key] = value;
		if (key === 'split') {
			calculateTotalPercentage();
		}
		unsaved = true;
	}

	function closeWalletModal() {
		showWalletModal = false;
	}

	function deletePerson(index) {
		const personName = data.value.destinations[index].name || 'this person';
		if (window.confirm(`Are you sure you want to delete ${personName}?`)) {
			data.value.destinations = data.value.destinations.filter((_, i) => i !== index);
			calculateTotalPercentage();
		}
	}
</script>

<value-header>
	<mobile-top>
		<h3>Value Block</h3>
	</mobile-top>
	<total-percentage>
		Total Percentage: {data?.settings?.totalPercentage?.toFixed(2) || 0}%

		<span class="warning">
			{data.settings.totalPercentage !== 100
				? 'Warning: Total percentage must equal 100%'
				: ''}</span
		>
	</total-percentage>
	<button type="button" on:click={addPerson}>Add Person</button>
</value-header>

{#each data.value.destinations as person, index}
	<person
		on:click={() => {
			editingIndex = index;
			showWalletModal = true;
		}}
	>
		<info>
			<p style={person.name ? '' : 'color:red'}>
				{person.name || 'a name is required for this person'}
			</p>
			<p class="percentage" style={person.split ? '' : 'color:red'}>
				{person.split || 0}% {person.fee ? '(fee)' : ''}
			</p>
		</info>
		<button on:click={deletePerson.bind(this, index)}>
			<Delete size={24} />
		</button>
	</person>
{/each}

{#if showWalletModal}
	<blurred-background on:mousedown|self={closeWalletModal} on:touchend|self={closeWalletModal}>
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
					person={data.value.destinations[editingIndex]}
					index={editingIndex}
					{updatevalue}
					bind:showProviderInput
					bind:provider
				/>
			{/if}
		</wallet-modal>
	</blurred-background>
{/if}

<style>
	.warning {
		color: red;
		font-weight: bold;
		font-size: 0.9em;
		text-align: center;
		min-height: 32px;
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

	value-header h3 {
		margin: 0;
	}

	value-header button {
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 0 32px;
	}

	total-percentage {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
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
		z-index: 99;
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

	@media (max-width: 799px) {
		mobile-top {
			margin-bottom: 0.25em;
		}

		wallet-modal {
			width: calc(100% - 32px);
		}
	}
</style>
