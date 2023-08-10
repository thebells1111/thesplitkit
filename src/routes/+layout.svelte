<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { remoteServer, user, catalog, albyReady, loaded } from '$/stores';

	import Header from '$lib/MainHeader/Header.svelte';

	onMount(() => {
		loadAlby();
	});

	async function loadAlby() {
		console.log('load alby');
		const code = $page.url.searchParams.get('code');
		// $user.loggedIn = true;
		if (code) {
			console.log('checking Alby code');
			let redirect_uri = $page.url.href.split('/?')[0].split('?')[0];
			// redirect_uri = redirect_uri.slice(0, -1)
			removeQueryFromUrl();
			let res = await fetch('/api/alby/auth?code=' + code + '&redirect_uri=' + redirect_uri, {
				credentials: 'include'
			});
			let data = await res.json();
			console.log(data);
			if (data.lightning_address || true) {
				$user.loggedIn = true;
				$user.name = data.lightning_address;
				$user.balance = data.balance;
				await fetch(remoteServer + '/api/alby/gettoken?code=' + data.code, {
					credentials: 'include'
				});

				$albyReady = true;
			}
		} else if (!$user.loggedIn) {
			console.log('refresh');
			let res = await fetch('/api/alby/refresh', {
				credentials: 'include'
			});

			let data = await res.json();
			console.log(data);
			if (data.lightning_address) {
				$user.loggedIn = true;
				$user.name = data.lightning_address;
				$user.balance = data.balance;
				await fetch(remoteServer + '/api/alby/gettoken?code=' + data.code, {
					credentials: 'include'
				});

				fetch('/api/database/fetch-user')
					.then((res) => res.json())
					.then((data) => {
						console.log(data);
						$catalog = data.catalog || [];
						console.log($user);
						console.log($catalog);
					});
			}

			$albyReady = true;
		} else {
			console.log('user already logged in');
			$albyReady = true;
		}
		$loaded = true;
	}

	function removeQueryFromUrl() {
		const urlWithoutQuery =
			window.location.protocol + '//' + window.location.host + window.location.pathname;
		window.history.replaceState({}, document.title, urlWithoutQuery);
	}
</script>

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
</style>
