<script>
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import { remoteServer } from '$/stores';
	let username = '';
	let password = '';
	let showSaved = false;

	const sendData = async () => {
		const payload = { username, password };

		const response = await fetch(remoteServer + '/api/sk/saveremotecreds', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data);
		showSaved = true;
		setTimeout(() => (showSaved = false), 500);
		console.log(showSaved);
	};
</script>

<div>
	<p>Remote Control Credentials</p>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={sendData}>Send Data</button>
</div>

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}

<style>
	div {
		margin: 8px 0;
		width: 100%;
	}
	p {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 6px;
		color: var(--color-theme-blue);
		margin: 0;
	}

	input {
		margin: 0 6px;
	}
</style>
