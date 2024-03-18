<script>
	import { onMount, afterUpdate } from 'svelte';
	import { page } from '$app/stores';
	import io from 'socket.io-client';

	import { remoteServer } from '$/stores';
	import BoostCard from './BoostCard.svelte';

	let boostBoardSocket;
	let scrollContainer;
	let boosts = [];

	onMount(async () => {
		const url = remoteServer + '/boostboard?feed_guid=' + $page.params.guid;
		boostBoardSocket = io.connect(url, { withCredentials: true });

		boostBoardSocket.on('testResponse', function (data) {
			console.log(data);
			boosts = boosts.concat(data);
		});
		boostBoardSocket.on('tlv', function (data) {
			console.log(data);
			boosts = boosts.concat(data);
		});
	});

	afterUpdate(() => {
		scrollContainer.scrollTop = scrollContainer.scrollHeight;
	});

	function sendTest() {
		console.log('sending test');
		leaderBoardSocket.emit('test', 'hello');
	}
</script>

<!-- <button on:click={sendTest}>Test</button> -->

<div class="scrollable-div" bind:this={scrollContainer}>
	{#each boosts as boost}
		<BoostCard {boost} />
	{/each}
</div>

<style>
	.scrollable-div {
		overflow-y: auto;
		height: 100%;
		background-color: #353535;
		color: #ebebeb;
	}
</style>
