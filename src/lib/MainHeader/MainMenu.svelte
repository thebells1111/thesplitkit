<script>
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AccountIcon from '$lib/icons/Account.svelte';
	import MenuIcon from '$lib/icons/Menu.svelte';

	import { user, albyClientId, remoteServer } from '$/stores';

	let expandMenu = false;

	async function logout() {
		const res = await fetch(remoteServer + '/api/alby/logout', { credentials: 'include' });

		const data = await res.json();
		console.log(data);
		$user = data;
		goto('/');
	}

	const redirectUrl =
		`https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=${
			$page.url.href.split('/?')[0].split('?')[0]
		}` + `&scope=account:read%20balance:read%20payments:send%20invoices:read`;

	$: console.log($page);
</script>

<button
	class="icon"
	on:click={() => {
		expandMenu = true;
	}}
>
	{#if $user.loggedIn}
		<MenuIcon size="40" />
	{:else}
		<AccountIcon size="40" />
	{/if}
</button>

{#if expandMenu}
	<container
		on:click={() => {
			expandMenu = false;
		}}
		on:keypress={() => {
			expandMenu = false;
		}}
	>
		<menu>
			<account-button-hover />
			<ul transition:slide={{ duration: 200 }}>
				{#if $user.loggedIn}
					<li on:click={logout} on:keypress={logout}>Log Out</li>

					<li><a href="/events">Events</a></li>
					{#if $page?.params?.guid}
						<li><a href="/soundboard/{$page.params.guid}">Sound Board</a></li>
					{/if}
					{#if $page?.params?.guid}
						<li><a href="/triggerboard/{$page.params.guid}">Trigger Board</a></li>
					{/if}
					{#if $page?.params?.guid}
						<li><a href="/boostboard/{$page.params.guid}">Boost Board</a></li>
					{/if}
				{:else}
					<li>
						<a href="/login"> Log In </a>
					</li>
				{/if}
			</ul>
		</menu>
	</container>
{/if}

<style>
	container {
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
		top: 0;
		left: 0;
		z-index: 33;
	}

	button {
		align-self: flex-end;
	}

	account-button-hover {
		display: block;
		width: 56px;
		height: 42px;
		cursor: pointer;
	}
	menu {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		right: 8px;
		margin: 0;
	}

	ul {
		width: 150px;
		background-color: blue;
		padding: 0;
		margin: 0;
		overflow: hidden;
		background-color: white;
		box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.75);
	}

	li {
		padding: 8px;
		list-style: none;
		width: calc(100% - 16px);
		text-align: end;
		cursor: pointer;
	}
	li:hover {
		background-color: var(--color-poster-bg-1);
	}

	a {
		display: block;
		width: 100%;
	}
</style>
