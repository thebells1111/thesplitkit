<script>
	import { remoteServer } from '$/stores';

	let email = '';
	let password = '';
	let showSaved = false;

	const saveCredentials = async () => {
		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/sk/register', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		console.log(data);
		showSaved = true;
		setTimeout(() => {
			showSaved = false;
			// showRegisterModal = false;
		}, 500);
		console.log(showSaved);
	};
</script>

<credentials>
	<p>The Split Kit is providing email and password as an alternative to Alby for log in.</p>
	<p>This will ensure your continued access to the Split Kit.</p>
	<p>Please provide a email and password for future log in.</p>
	<p>A valid email is required for password recovery.</p>
	<input type="email" bind:value={email} placeholder="E-mail" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={saveCredentials}>Register</button>
</credentials>

{#if showSaved}
	<SaveModal>
		<h2>Saved</h2>
	</SaveModal>
{/if}
