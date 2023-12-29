<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import { user, albyClientId, loaded, albyReady, liveBlocks, activePageGuid } from '$/stores';

	const redirectUrl =
		`https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=${$page.url.href}` +
		`&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	let showLoading = false;
	let unmounted = true;

	const guid = $page.params.guid;
	$: console.log(guid);
	onMount(() => {
		if (!$liveBlocks.length || $activePageGuid !== guid) {
			showLoading = true;
		}
		unmounted = false;
	});

	$: if ($loaded && $albyReady) {
		setTimeout(() => (showLoading = false), 2000);
	}
</script>

{#if $page.route.id !== '/(main)/events/[guid]'}
	{#if !unmounted}
		{#if showLoading}
			<loading>
				<img src="/splitkit300.png" />
			</loading>
		{:else if !$user?.loggedIn && guid !== 'test'}
			<div>
				<h2>Please <a href={redirectUrl}> Log In </a> to Continue</h2>
			</div>
		{:else}
			<slot />
		{/if}
	{/if}
{:else}
	<slot />
{/if}

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-top: 40px;
	}

	loading {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	img {
		width: 1200px;
		height: 1200px;
		animation: ripple 4s linear;
		position: fixed;
		z-index: 99;
	}

	@keyframes ripple {
		0% {
			transform: scale(0.2);
			opacity: 0;
		}

		25% {
			transform: scale(0.2);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
