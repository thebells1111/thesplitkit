<script>
	import { page } from '$app/stores';
	import { albyClientId } from '$/stores';
	import { goto } from '$app/navigation';
	import { user, userReady, loaded } from '$/stores';

	let email = '';
	let password = '';
	let warning;

	async function login() {
		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/sk/login', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		if (data?.status === 'success') {
			$userReady = true;
			$user.loggedIn = true;
			$loaded = true;
			goto('/events');
		} else {
			warning = data.message;
		}
		console.log(data);
	}

	let redirect_uri = $page.url.origin + '/events';

	const redirectUrl =
		`https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=` +
		redirect_uri +
		`&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	import { remoteServer } from '$/stores';

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			login();
		}
	}
</script>

{#if warning}
	<h2 class="warning">{warning}</h2>
{/if}
<div>
	<input type="email" bind:value={email} placeholder="E-mail" on:keydown={handleKeydown} />
	<input type="password" bind:value={password} placeholder="Password" on:keydown={handleKeydown} />
	<button on:click={login}>Log In</button>

	<p>-or-</p>
	<h2>Log in with <a href={redirectUrl}> Alby </a></h2>

	<p>-or-</p>
	<h2><a href="/register"> Register your email </a></h2>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		margin: 20px 128px;
		align-items: center;
	}

	input {
		width: calc(100% - 8px);
		margin: 4px 0;
	}
	button {
		width: 100%;
		margin: 4px 0;
	}

	h2.warning {
		margin: 4px auto;
		color: red;
	}

	@media (max-width: 799px) {
		div {
			margin: 20px 8px;
		}
	}
</style>
