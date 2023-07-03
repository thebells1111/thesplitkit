<script>
	import MainMenu from './MainMenu.svelte';
	import BackArrow from '$lib/icons/BackArrow.svelte';
	import { user } from '$/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: guid = $page.params.guid;
	$: route = $page.route.id;
	console.log(route);

	console.log($page);

	$: showBackButton = [
		'/(main)/events/dashboard/[guid]',
		'/(main)/events/creator',
		'/(main)/remotevalue/[guid]',
		'/(main)/chapters/[guid]'
	].find((v) => v === route);

	function handleBackButton() {
		if (['/(main)/events/dashboard/[guid]', '/(main)/events/creator'].find((v) => v === route)) {
			goto('/events');
		}

		if (['/(main)/remotevalue/[guid]', '/(main)/chapters/[guid]'].find((v) => v === route)) {
			goto(`/events/dashboard/${guid}`);
		}
	}
</script>

<header>
	{#if showBackButton}
		<button class="icon" on:click={handleBackButton}><BackArrow size="40" /></button>
	{:else}
		<spacer />
	{/if}
	<p>{$user.name || ''}</p>
	<MainMenu />
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 8px);
		margin: 0 8px;
	}

	p {
		padding: 0;
		margin: 0;
	}

	button {
		padding: 0;
	}

	spacer {
		display: block;
		width: 52px;
	}
</style>
