<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import io from 'socket.io-client';

	import { remoteServer } from '$/stores';

	let leaderBoardSocket;

	onMount(async () => {
		const url = remoteServer + '/leaderboard?event_id=' + $page.params.guid;
		leaderBoardSocket = io.connect(url, { withCredentials: true });

		leaderBoardSocket.on('testResponse', function (data) {
			console.log(data);
		});
		leaderBoardSocket.on('tlv', function (data) {
			console.log(data);
		});
	});

	function sendTest() {
		console.log('sending test');
		leaderBoardSocket.emit('test', 'hello');
	}
</script>

<button on:click={sendTest}>Test</button>
