<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { remoteServer, user, albyReady, loaded } from '$/stores';
	import { goto } from '$app/navigation';

	import Header from '$lib/MainHeader/Header.svelte';

	let email = '';
	let password = '';
	let showSaved = false;

	onMount(async () => {
		if (!(await loadSKC())) {
			loadAlby();
		} else {
			// loadAlby();
			$albyReady = true;
			$user.loggedIn = true;
			$loaded = true;
		}
	});

	async function loadSKC() {
		console.log('refresh');
		let res = await fetch(remoteServer + '/api/sk/refresh', {
			credentials: 'include'
		});
		let data = await res.json();
		return data.status === 'success';
	}

	async function loadAlby() {
		const code = $page.url.searchParams.get('code');
		console.log($page);
		// $user.loggedIn = true;
		if (code) {
			console.log('checking Alby code');
			let redirect_uri = $page.url.href.split('/?')[0].split('?')[0];
			// redirect_uri = redirect_uri.slice(0, -1);

			let res = await fetch(
				remoteServer + '/api/alby/auth?code=' + code + '&redirect_uri=' + redirect_uri,
				{
					credentials: 'include'
				}
			);
			let data = await res.json();
			if (data.lightning_address) {
				$user.loggedIn = true;
				$user.name = data.lightning_address;
				$user.balance = data.balance;
				let userRes = await fetch(remoteServer + '/api/sk/checkforuser', {
					credentials: 'include'
				});
				let userData = await userRes.json();
				if (
					!userData.hasCreds &&
					($page.route.id === '/(main)' || $page.route.id === '/(main)/events')
				) {
					goto('/register');
				}
				$albyReady = true;
			}
			const urlWithoutQuery = window.location.href.split('?')[0];
			window.history.replaceState(null, null, urlWithoutQuery);
		} else if (!$user.loggedIn) {
			console.log('refresh');
			let res = await fetch(remoteServer + '/api/alby/refresh', {
				credentials: 'include'
			});
			let data = await res.json();
			console.log(data);
			if (data.lightning_address) {
				$user.loggedIn = true;
				$user.name = data.lightning_address;
				$user.balance = data.balance;
			}

			let userRes = await fetch(remoteServer + '/api/sk/checkforuser', {
				credentials: 'include'
			});
			let userData = await userRes.json();
			console.log(userData);
			if (
				!userData.hasCreds &&
				($page.route.id === '/(main)' || $page.route.id === '/(main)/events')
			) {
				goto('/register');
			}

			$albyReady = true;
		} else {
			console.log('user already logged in');
			$albyReady = true;
		}
		$loaded = true;
	}

	const saveCredentials = async () => {
		const payload = { email, password };

		const response = await fetch(remoteServer + '/api/sk/register', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		const data = await response.json();
		showSaved = true;
		setTimeout(() => {
			showSaved = false;
		}, 500);
		console.log(showSaved);
	};
</script>

<svelte:head><script src="/tinymce/tinymce.min.js"></script></svelte:head>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0;
		box-sizing: border-box;
		overflow: hidden;
		height: calc(100vh - 46px);
	}

	credentials {
		display: flex;
		flex-direction: column;
		margin: 32px 0 72px 0;
	}

	credentials > input {
		margin-bottom: 8px;
	}

	credentials > p {
		margin: 2px 0;
		font-weight: 550;
	}

	credentials > p:last-of-type {
		margin-bottom: 8px;
	}
</style>
