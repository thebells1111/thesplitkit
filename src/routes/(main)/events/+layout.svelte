<script>
	import { page } from '$app/stores';

	import { user, albyClientId, loaded, albyReady } from '$/stores';

	const redirectUrl =
		`https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=${$page.url.href}` +
		`&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	let showLoading = true;

	$: if ($loaded && $albyReady) {
		setTimeout(() => (showLoading = false), 2000);
	}
</script>

{#if $page.route.id !== '/(main)/events/[guid]'}
	{#if showLoading}
		<loading>
			<img src="/splitkit300.png" />
		</loading>
	{:else if !$user?.loggedIn}
		<div>
			<h2>Please <a href={redirectUrl}> Log In </a> to Continue</h2>
		</div>
	{:else}
		<slot />
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
		position: relative;
		bottom: 40px;
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
