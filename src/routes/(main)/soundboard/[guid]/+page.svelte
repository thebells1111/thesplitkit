<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import io from 'socket.io-client';

	import { remoteServer } from '$/stores';

	let players = [];

	let sounds = [
		'https://curiocaster.com/rss/ep1/Louisiana - Duke Ellington and His Orchestra-restored.mp3'
	];

	let leaderBoardSocket;

	onMount(async () => {
		const url = remoteServer + '/leaderboard?event_id=' + $page.params.guid;
		leaderBoardSocket = io.connect(url, { withCredentials: true });

		leaderBoardSocket.on('testResponse', function (data) {
			playSound(sounds[0]);
		});
		leaderBoardSocket.on('tlv', function (data) {
			console.log(data);
		});
	});

	function sendTest() {
		console.log('sending test');
		leaderBoardSocket.emit('test', 'hello');
	}

	function playSound(src) {
		let audio = new Audio(src);
		audio.onended = function () {
			this.remove();
		};
		audio.play();
	}
</script>

<button on:click={sendTest}>Test</button>

<input type="text" bind:value={sounds[0]} />
