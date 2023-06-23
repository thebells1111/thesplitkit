<script>
	import { onMount } from 'svelte';
	import io from 'socket.io-client';
	import clone from 'just-clone';
	import BroadcastBlockCard from './BroadcastBlockCard.svelte';
	import Person from './Person.svelte';

	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import {
		remoteServer,
		socket,
		activeBroadcastGuid,
		liveBlocks,
		defaultBlockGuid
	} from '$/stores';
	export let blocks = [];
	export let filterType;

	let broadcastingBlockIndex;
	export let guid = $page.params.guid;

	onMount(async () => {
		if (!$liveBlocks.length) {
			loadSocket();
		}
	});

	$: if ($activeBroadcastGuid !== guid) {
		$activeBroadcastGuid = guid;
		loadSocket;
	}

	function loadSocket() {
		$socket = null;
		tick();
		socketConnect();
		console.log('socket connect');
	}

	function socketConnect() {
		$socket = io(remoteServer + '/event?event_id=' + guid, { withCredentials: true });

		$socket.on('connect', () => {
			if (guid) {
				// Send a message with the valueGuid
				$socket.emit('connected', guid);
				console.log('socket connect');
				if ($liveBlocks[0]) {
					handleBroadcast($liveBlocks[0]);
				}
			} else {
				console.log('guid is not defined');
			}
		});
	}

	function handleBroadcast(block) {
		const serverData = processBlock(clone(block));
		$socket.emit('valueBlock', { valueGuid: guid, serverData });
	}

	function addFees(destinations) {
		return destinations?.filter((v) => v.fee) || [];
	}

	function updateSplits(destinations, split) {
		return clone(destinations)
			?.filter((v) => !v.fee)
			?.map((v) => {
				v.split = (v.split * split) / 100;
				return v || [];
			});
	}

	function processBlock(block) {
		let defaultBlock =
			block.blockGuid === $defaultBlockGuid
				? undefined
				: $liveBlocks.find((v) => v.blockGuid === $defaultBlockGuid);

		let split = defaultBlock ? block.settings.split : 100;

		let newDestinations = [];

		if (defaultBlock) {
			newDestinations = newDestinations.concat(addFees(defaultBlock?.value?.destinations));
			newDestinations = newDestinations.concat(
				updateSplits(defaultBlock?.value?.destinations, 100 - split)
			);
		}
		newDestinations = newDestinations.concat(addFees(block?.value?.destinations));
		newDestinations = newDestinations.concat(updateSplits(block?.value?.destinations, split));

		delete block.settings;

		if (!block.link.text || block.link.text === 'Link - click to edit') {
			block.link.text = block.link.url;
		}

		if (!block.link.url) {
			delete block.link;
		}

		if (block?.value?.destinations) {
			block.value.destinations = newDestinations;
		}

		return block;
	}
</script>

<div>
	{#if !$socket}
		<button class="primary socket-connect" on:click={socketConnect}
			>Connect to Live Value Server</button
		>
	{/if}
	<top>
		<transparent-spacer />
	</top>

	{#if filterType === 'person'}
		<Person {blocks} bind:broadcastingBlockIndex {handleBroadcast} />
	{:else}
		<blocks>
			{#each blocks as block, index}
				<BroadcastBlockCard {block} {index} bind:broadcastingBlockIndex {handleBroadcast} />
			{/each}
		</blocks>
	{/if}
</div>

<style>
	div {
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	top {
		position: relative;
		width: 100%;
		display: flex;
	}

	transparent-spacer {
		display: block;
		height: 20px;
		width: 100%;
		background: linear-gradient(to top, transparent, white);
		position: absolute;
		bottom: -20px;
	}

	blocks {
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: auto;
		padding-top: 18px;
		margin-bottom: 0px;
	}

	.socket-connect {
		margin: 0 auto 8px auto;
		width: 250px;
		background-image: linear-gradient(to bottom, hsl(277, 100%, 44%), hsl(277, 100%, 26.7%));
		color: var(--color-text-1);
	}
</style>
