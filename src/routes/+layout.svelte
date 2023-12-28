<script>
	import './styles.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { remoteServer, user, albyReady, loaded } from '$/stores';

	import Modal from '$lib/Modal/Modal.svelte';

	import Header from '$lib/MainHeader/Header.svelte';
	let showRegisterModal = false;

	onMount(() => {
		loadAlby();
	});

	async function loadAlby() {
		const code = $page.url.searchParams.get('code');
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
			if (!userData.hasCreds) {
				showRegisterModal = true;
			}

			$albyReady = true;
		} else {
			console.log('user already logged in');
			$albyReady = true;
		}
		$loaded = true;
	}

	$: console.log(showRegisterModal);
</script>

<svelte:head><script src="/tinymce/tinymce.min.js"></script></svelte:head>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>
</div>

{#if !['/(main)/promotion/[eventGuid]/[blockGuid]', '/(main)/live/[guid]'].find((v) => v === $page.route.id)}
	{#if showRegisterModal}
		<Modal bind:showModal={showRegisterModal}>
			<div>Hello</div>
		</Modal>
	{/if}
{/if}

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
