<script>
	import { remoteServer, liveBlocks } from '$/stores';
	let username = '';
	let password = '';

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
	};
</script>

<div>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={sendData}>Send Data</button>
</div>

<style>
	/* Add your CSS here */
</style>
