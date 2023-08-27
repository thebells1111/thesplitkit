<script>
	export let provider;
	export let showProviderInput;
	export let updatevalue;
	export let index;

	let username = '';
	let noUserFound = false;
	let userFound = false;

	async function handleProviderSubmit() {
		noUserFound = false;
		let name = username.split('@');
		if (!name[0]) {
			name.shift();
		}
		const providerMapping = {
			Alby: 'https://getalby.com/.well-known/keysend/',
			Fountain: 'https://fountain.fm/.well-known/keysend/'
		};

		const providerUrl = providerMapping[provider] || '';

		if (providerUrl) {
			try {
				const res = await fetch(`${providerUrl}${name[0]}`);
				const info = await res.json();
				if (info.status === 'OK') {
					updatevalue(index, 'address', info.pubkey);
					updatevalue(index, 'customValue', info.customData[0].customValue);
					updatevalue(index, 'customKey', info.customData[0].customKey);
					userFound = `${name}@${provider.toLowerCase()}${
						provider === 'Fountain' ? '.fm' : '.com'
					}`;
				} else {
					throw new Error();
				}
				setTimeout(cancelProviderSubmit.bind(this, true), 3500);
			} catch (error) {
				noUserFound = true;
			}
		} else if (provider === 'v4v.app' && name[0]) {
			updatevalue(
				index,
				'address',
				'0266ad2656c7a19a219d37e82b280046660f4d7f3ae0c00b64a1629de4ea567668'
			);
			updatevalue(index, 'customValue', name[0]);
			updatevalue(index, 'customKey', 818818);
			userFound = name;
			userFound = `${name}@v4v.app`;

			setTimeout(cancelProviderSubmit.bind(this, true), 3500);
		} else {
			noUserFound = true;
		}
	}

	async function cancelProviderSubmit() {
		showProviderInput = false;
		provider = '';
		username = '';
		noUserFound = false;
		userFound = false;
	}
</script>

<div>
	{#if userFound}
		<user-found>
			<h4>{userFound} address has been added to your value block.</h4>
			<h4>Show Advanced Fields to view address.</h4>
		</user-found>
	{:else}
		<wallet-provider>
			<input bind:value={username} placeholder={`Enter Your ${provider} User Name`} />
			<wallet-provider-button-container>
				<button class="submit-provider primary" on:click={handleProviderSubmit}>Submit</button>
				<button class="cancel-provider primary" on:click={cancelProviderSubmit}>Cancel</button>
			</wallet-provider-button-container>
			{#if noUserFound}
				<p>That username doesn't exist.</p>
			{/if}
		</wallet-provider>
	{/if}
</div>

<style>
	div {
		height: 182px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	wallet-provider {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	wallet-provider input {
		padding: 4px;
	}

	wallet-provider-button-container {
		margin-top: 8px;
		display: flex;
		align-items: center;
		justify-content: space-around;
		width: 100%;
	}

	button {
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
	}

	.cancel-provider {
		background-color: rgb(180, 0, 39);
	}

	@media (max-width: 799px) {
		div {
			min-height: 262px;
		}
	}
</style>
