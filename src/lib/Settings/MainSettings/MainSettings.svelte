<script>
	import clone from 'just-clone';
	import Save from '$lib/icons/Save.svelte';

	import { remoteServer, mainSettings, liveBlocks } from '$/stores';
	import { page } from '$app/stores';
	import DefaultSplits from './DefaultSplits.svelte';
	import BroadcastMode from './BroadcastMode.svelte';
	import PlaylistSettings from './PlaylistSettings.svelte';
	import ChaptersSettings from './ChaptersSettings.svelte';

	let mainUnsaved = false;
	let initialized = false;
	let savedSettings = {};
	let updateAllSplits = false;

	$: compareSettings($mainSettings);

	function compareSettings() {
		if (JSON.stringify($mainSettings) !== JSON.stringify(savedSettings)) {
			savedSettings = clone($mainSettings);
			if (initialized) {
				mainUnsaved = true;
			} else {
				initialized = true;
			}
		}
	}

	function saveSettings() {
		fetch(remoteServer + '/api/sk/savesettings', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ settings: $mainSettings, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
			})
			.catch((error) => console.error(error));

		if (updateAllSplits) {
			$liveBlocks.forEach((v) => (v.settings.split = $mainSettings.splits));
			$liveBlocks = $liveBlocks;
			fetch(remoteServer + '/api/sk/saveblocks', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ blocks: $liveBlocks, guid: $page.params.guid })
			})
				.then((response) => response.json())
				.then((newData) => {
					console.log(newData);
				})
				.catch((error) => console.error(error));
		}

		mainUnsaved = false;
	}
</script>

<button class="save" class:unsaved={mainUnsaved} on:click={saveSettings}>
	<Save size="32" />
</button>

<DefaultSplits bind:mainUnsaved bind:updateAllSplits />
<BroadcastMode bind:mainUnsaved />

{#if $mainSettings?.broadcastMode === 'playlist'}
	<!-- <PlaylistSettings bind:mainUnsaved /> -->
{/if}

{#if $mainSettings?.broadcastMode === 'chapters'}
	<ChaptersSettings bind:mainUnsaved />
{/if}

<style>
	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 25px;
		padding: 0;
		margin: 16px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		position: relative;
		right: 100px;
	}

	.unsaved {
		animation: heartbeat 1s infinite;
		z-index: 2;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
		50% {
			transform: scale(1.1);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
	}
</style>
