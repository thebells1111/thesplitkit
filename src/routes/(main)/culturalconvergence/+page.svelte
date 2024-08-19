<script>
	import { onMount } from 'svelte';
	import { remoteServer, socket } from '$/stores';
	import io from 'socket.io-client';
	import Video from './Video.svelte';

	let data = {
		video1: '',
		video2: '',
		poll: '',
		boostBoard: '',
		chat: ''
	};

	let expandTop = true;
	let expandMiddle = true;
	let expandBottom = true;

	onMount(async () => {
		socketConnect();
	});

	async function socketConnect() {
		const liveItemSocket = io(remoteServer + '/event?event_id=culturalconvergence', {
			withCredentials: true
		});

		liveItemSocket.on('connect', () => {
			liveItemSocket.emit('connected', 'culturalconvergence');
			console.log('socket connect');
		});

		liveItemSocket.on('remoteValue', function (_data) {
			console.log(_data);
			data = _data;
		});

		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=culturalconvergence');
		const resData = await res.json();
		console.log(resData);
		data = resData.blocks;
		console.log(data);
	}
</script>

<top-pane>
	<screen-1>
		<Video bind:src={data.video1} />
	</screen-1>
	<screen-2>
		<Video bind:src={data.video2} />
	</screen-2>
</top-pane>

<bottom-pane>
	<screen>
		<stuff>
			<h1>Boost Board</h1>
		</stuff>
	</screen>
	<screen>
		<stuff>
			<h1>Poll</h1>
		</stuff>
	</screen>
	<screen>
		<stuff>
			<h1>Chat</h1>
		</stuff>
	</screen>
</bottom-pane>

<style>
	top-pane,
	bottom-pane {
		display: flex;
		width: calc(100%);
		height: 50%;
		max-height: 50%;
	}

	screen-1,
	screen-2 {
		height: 100%;
		width: 100%;
	}

	bottom-pane screen {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		margin-top: 16px;
		background-color: gray;
		border: 1px solid black;
	}
</style>
