<script>
	import MainMenu from './MainMenu.svelte';
	import BackArrow from '$lib/icons/BackArrow.svelte';
	import PlayIcon from '$lib/icons/PlayArrow.svelte';
	import StopIcon from '$lib/icons/Stop.svelte';
	import { user, liveEnclosure, liveMode } from '$/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	$: guid = $page.params.guid;
	$: route = $page.route.id;

	let player;
	let isStopped = true;

	$: showBackButton = [
		'/(main)/events/dashboard/[guid]',
		'/(main)/events/creator',
		'/(main)/events/import',
		'/(main)/remotevalue/[guid]',
		'/(main)/chapters/[guid]',
		'/(main)/soundboard/[guid]'
	].find((v) => v === route);

	$: showPlayButton = ['/(main)/live/[guid]'].find((v) => v === route) && player?.src;

	$: if (['playlist', 'podcast'].find((v) => $liveMode === v) && $liveEnclosure) {
		player = new Audio();
		player.src = $liveEnclosure;
	}

	function handleAudio() {
		if (player) {
			if (isStopped) {
				// The audio is stopped, so start playing it.
				player.src = $liveEnclosure;
				player.play();
				isStopped = false;
			} else {
				// The audio is playing, so stop it.
				player.src = '';
				isStopped = true;
			}
		}
	}

	function handleBackButton() {
		if (
			['/(main)/events/dashboard/[guid]', '/(main)/events/creator', '/(main)/events/import'].find(
				(v) => v === route
			)
		) {
			goto('/events');
		}

		if (
			['/(main)/remotevalue/[guid]', '/(main)/chapters/[guid]', '/(main)/soundboard/[guid]'].find(
				(v) => v === route
			)
		) {
			goto(`/events/dashboard/${guid}`);
		}
	}
</script>

{#if route !== '/(main)/boostboard/[guid]'}
	<header>
		{#if showBackButton}
			<button class="icon" on:click={handleBackButton}><BackArrow size="40" /></button>
		{:else if showPlayButton}
			<button class="play" on:click={handleAudio}
				>{#if isStopped}
					<PlayIcon size="40" />
				{:else}
					<StopIcon size="40" />
				{/if}</button
			>
		{:else}
			<spacer />
		{/if}

		<p>{$user.name || ''}</p>
		{#if route === '/(main)/soundboard/[guid]'}
			<a href="/soundboard/instructions">Sound Board Instructions</a>
		{/if}
		{#if route === '/(main)/triggerboard/[guid]'}
			<a href="/triggerboard/instructions">Trigger Board Instructions</a>
		{/if}
		<MainMenu />
	</header>
{/if}

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 8px);
		margin: 0 8px;
		height: 42px;
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

	button.play {
		color: var(--color-text-0);
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: none;
		padding: 0;
		position: relative;
		left: -4px;
		top: 2px;
	}
</style>
