<script>
	import clone from 'just-clone';

	import { remoteServer, mainSettings, liveBlocks } from '$/stores';
	import { page } from '$app/stores';
	import DefaultSplits from './DefaultSplits.svelte';
	import BroadcastMode from './BroadcastMode.svelte';
	import PlaylistSettings from './PlaylistSettings.svelte';
	import PrerecordedSettings from './PrerecordedSettings.svelte';
	import PodcastSettings from './PodcastSettings.svelte';
	import RemoteCreds from './RemoteCreds.svelte';
	import EditTimes from './EditTimes.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import BroadcastSettings from './BroadcastSettings.svelte';
	import LowBandwidth from './LowBandwidth.svelte';

	let initialized = false;
	let savedSettings = {};
	let updateAllSplits = false;
	export let showOffsetStartTimes;

	export const saveMainSettings = () => {
		if ($page.params.guid !== 'test') {
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
				$liveBlocks.forEach((v) => {
					if (v) {
						v.settings.split = $mainSettings.splits;
					}
				});
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
						if (newData.status !== 200) {
							alert('You are no longer logged in, and your changes are not being saved.');
						}
					})
					.catch((error) => console.error(error));
			}
		}
	};

	async function copyToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				alert('ID copied to clipboard');
			})
			.catch((err) => {
				alert('Error copying ID to clipboard');
			});
	}
</script>

<div>
	<h2 on:click={copyToClipboard.bind(this, $page.params.guid)}>
		<span>Event ID:</span>
		{$page.params.guid}
		<CopyIcon size="24" />
	</h2>
	<BroadcastMode />
	<DefaultSplits bind:updateAllSplits />
	<EditTimes bind:showOffsetStartTimes />
	<RemoteCreds />
	<LowBandwidth />
	<BroadcastSettings />

	{#if $mainSettings?.broadcastMode === 'playlist'}
		<PlaylistSettings />
	{/if}

	{#if $mainSettings?.broadcastMode === 'podcast'}
		<PodcastSettings />
	{/if}

	{#if $mainSettings?.broadcastMode === 'edit'}
		<PrerecordedSettings />
	{/if}
</div>

<style>
	div {
		height: calc(100%);
		overflow: auto;
	}
	h2 {
		cursor: copy;
	}
	span {
		color: var(--color-theme-blue);
	}
</style>
