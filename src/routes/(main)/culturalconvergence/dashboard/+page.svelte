<script>
	import { onMount } from 'svelte';
	import { remoteServer, socket } from '$/stores';
	import io from 'socket.io-client';

	let data = {
		video1: '',
		video2: '',
		poll: '',
		boostBoard: '',
		chat: ''
	};

	onMount(async () => {
		socketConnect();
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=culturalconvergence');
		const _data = await res.json();
		data = _data.blocks;
	});

	function socketConnect() {
		$socket = io(remoteServer + '/event?event_id=culturalconvergence', { withCredentials: true });

		$socket.on('connect', () => {
			storedGuid = $socket.id;

			$socket.emit('connected', 'culturalconvergence');
			console.log('socket connect');
		});
	}

	function updateEvent() {
		$socket.emit('valueBlock', { valueGuid: 'culturalconvergence', serverData: data });
		saveBlocks(data);
	}

	async function saveBlocks(blocks, guid) {
		const res = await fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks, guid: 'culturalconvergence' })
		});
		const data = await res.json();
		console.log(data);
	}
</script>

<div>
	<h4>Video 1</h4>
	<a href="./video1" target="_blank">open Video 1 page</a>
	<input placeholder="url to video feed" bind:value={data.video1} />

	<h4>Video 2</h4>
	<a href="./video2" target="_blank">open Video 2 page</a>
	<input placeholder="url to video feed" bind:value={data.video2} />

	<h4>Poll Guid</h4>
	<input placeholder="event guid from The Split Kit" bind:value={data.poll} />

	<h4>Boost Board</h4>
	<input placeholder="url to boost board" bind:value={data.boostBoard} />

	<h4>Chat</h4>
	<a href="./chat" target="_blank">open Chat page</a>
	<input placeholder="url to chat" bind:value={data.chat} />

	<button on:click={updateEvent}>Update</button>
</div>

<style>
	div {
		padding: 8px;
		width: 100%;
	}
	h4 {
		margin: 0 32px 4px 0;
		display: inline-block;
	}

	input {
		margin: 0 0 4px 8px;
		width: calc(100% - 40px);
	}
</style>
