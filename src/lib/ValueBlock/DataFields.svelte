<script>
	import { slide } from 'svelte/transition';
	export let person;
	export let index;
	export let updatevalue;
	export let showProviderInput = false;
	export let provider;

	let showAdvanced = false;

	async function handleProviderSelect(providerName) {
		showProviderInput = true;
		provider = providerName;
	}
</script>

<value-container>
	<data-top>
		<name-header>
			<div>
				<label for="name-{index}">Name:</label>
				{#if !person.address}
					<p class="warning">
						Warning: The Lightning Address field in the Advanced Fields is required.
					</p>
				{/if}
			</div>
		</name-header>
		<input
			id="name-{index}"
			type="text"
			bind:value={person.name}
			on:input={(e) => updatevalue(index, 'name', e.target.value)}
			placeholder="Name (required)"
			class="required-input"
		/>

		<label for="split-{index}">Split:</label>
		<input
			id="split-{index}"
			type="number"
			min="0"
			max="100"
			step="1"
			bind:value={person.split}
			on:input={(e) => updatevalue(index, 'split', e.target.value)}
			placeholder="Split (required)"
			class="required-input"
		/>
	</data-top>
	<button-row>
		<wallets>
			<button class="provider alby" on:click={() => handleProviderSelect('Alby')}>
				<img alt="alby icon" src="/alby.png" />
				<span>Alby</span>
			</button>
			<button class="provider fountain" on:click={() => handleProviderSelect('Fountain')}>
				<img alt="fountain icon" src="/fountain.png" />
				<span>Fountain</span>
			</button>
			<button class="provider v4vapp" on:click={() => handleProviderSelect('v4v.app')}>
				<img alt="v4vapp icon" src="/v4vapp.webp" />
				<span>v4v.app</span>
			</button>
		</wallets>
		<button class="advanced" type="button" on:click={() => (showAdvanced = !showAdvanced)}>
			{showAdvanced ? 'Hide' : 'Show'} Advanced Fields
		</button>
	</button-row>
	{#if showAdvanced}
		<advanced-fields transition:slide={{ duration: 200 }}>
			<label for="ln-address-{index}">LN Address:</label>
			<input
				id="ln-address-{index}"
				type="text"
				bind:value={person.address}
				on:input={(e) => updatevalue(index, 'address', e.target.value)}
				placeholder="LN address (required)"
				class="required-input"
			/>

			<label for="custom-key-{index}">Custom Key:</label>
			<input
				id="custom-key-{index}"
				type="text"
				bind:value={person.customKey}
				on:input={(e) => updatevalue(index, 'customKey', e.target.value)}
			/>

			<label for="custom-value-{index}">Custom Value:</label>
			<input
				id="custom-value-{index}"
				type="text"
				bind:value={person.customValue}
				on:input={(e) => updatevalue(index, 'customValue', e.target.value)}
			/>
		</advanced-fields>
	{/if}
</value-container>

<style>
	data-top {
		margin-top: 16px;
		display: flex;
		flex-direction: column;
	}
	label {
		font-weight: 600;
	}
	input {
		margin: 4px 0px 8px 8px;
		padding: 4px;
	}

	name-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.delete {
		background-color: rgb(180, 0, 39);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
	}
	.required-input::placeholder {
		color: red;
	}

	advanced-fields {
		display: flex;
		flex-direction: column;
	}

	button.provider,
	button.advanced {
		margin: 0 0 8px 8px;
		width: 116px;
		font-weight: 600;
		border-radius: 20px;
		padding: 0;
		display: inline-flex;
		padding: 0 4px;
		align-items: center;
		border: 1px solid transparent;
	}

	button.advanced {
		width: auto;
		padding: 0 8px;
		height: 32px;
		background-color: rgb(0, 57, 180);
		color: white;
	}

	button.alby {
		background-color: hsl(41, 92%, 65%);
		color: hsl(0, 0%, 20%);
	}

	button.fountain {
		background-color: hsl(240, 7%, 11%);
		color: white;
	}

	button.v4vapp {
		background-color: hsl(0, 0%, 25%);
		color: white;
	}

	button > img {
		height: 30px;
		padding-right: 6px;
	}

	button.v4vapp > img {
		padding: 0 6px 0 0;
	}

	button.alby > img {
		height: 28px;
	}

	button-row {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.warning {
		color: red;
		font-weight: bold;
		font-size: 0.9em;
	}

	p.warning {
		display: inline-block;
		margin: 0 16px;
		padding: 0;
	}
	@media (max-width: 799px) {
		button-row {
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		wallets {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: center;
		}
	}
</style>
