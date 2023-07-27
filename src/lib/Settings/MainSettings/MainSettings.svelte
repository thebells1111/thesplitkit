<script>
	import clone from 'just-clone';

	import { remoteServer, mainSettings, liveBlocks } from '$/stores';
	import { page } from '$app/stores';
	import DefaultSplits from './DefaultSplits.svelte';
	import BroadcastMode from './BroadcastMode.svelte';
	import PlaylistSettings from './PlaylistSettings.svelte';
	import PrerecordedSettings from './PrerecordedSettings.svelte';
	import PodcastSettings from './PodcastSettings.svelte';

	let mainUnsaved = false;
	let initialized = false;
	let savedSettings = {};
	let updateAllSplits = false;
	let showSaved = false;
	export let showOffsetStartTimes;

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

	export const saveMainSettings = () => {
		showSaved = true;
		setTimeout(() => (showSaved = false), 500);
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
	};
</script>

<DefaultSplits bind:mainUnsaved bind:updateAllSplits />
<button
	on:click={() => {
		showOffsetStartTimes = true;
	}}>Offset Start Times</button
>
<BroadcastMode bind:mainUnsaved />Offset

{#if $mainSettings?.broadcastMode === 'playlist'}
	<!-- <PlaylistSettings bind:mainUnsaved /> -->
{/if}

{#if $mainSettings?.broadcastMode === 'podcast'}
	<PodcastSettings bind:mainUnsaved />
{/if}

{#if $mainSettings?.broadcastMode === 'edit'}
	<PrerecordedSettings bind:mainUnsaved />
{/if}

<style>
	button {
		margin: 8px;
		align-self: flex-start;
	}
</style>
