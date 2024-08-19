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

<pane class:collapse={!expandTop && !expandMiddle && !expandBottom}>
	<top class:expand={expandTop}>
		<spacer />
		<stuff>
			<Video bind:src={data.video1} />
		</stuff>
		<button on:click={() => (expandTop = !expandTop)}> {expandTop ? '-' : '+'} </button>
	</top>
	<middle class:expand={expandMiddle}>
		<stuff>
			<Video bind:src={data.video2} />
		</stuff>
		<button on:click={() => (expandMiddle = !expandMiddle)}> {expandMiddle ? '-' : '+'} </button>
	</middle>
	<bottom class:expand={expandBottom}>
		<stuff />
		<button on:click={() => (expandBottom = !expandBottom)}> {expandBottom ? '-' : '+'} </button>
	</bottom>
</pane>

<style>
	pane {
		display: flex;
		flex-direction: column;
		width: calc(100%);
		height: 100%;
	}
	pane.collapse {
		height: 96px;
	}

	top,
	middle,
	bottom {
		display: block;
		height: 32px;
		width: 100%;
		border: 1px solid black;
		flex-grow: 1;
		overflow: hidden;
		position: relative;
		min-height: 32px;
	}

	stuff {
		display: block;
		width: 100%;
		height: 100%;
		margin-top: 16px;
		background-color: gray;

		border: 1px solid black;
	}

	top > stuff {
		border-color: red;
	}

	middle > stuff {
		border-color: purple;
		overflow: hidden;
	}

	bottom > stuff {
		border-color: blue;
	}

	.expand {
		height: 100%;
	}

	button {
		position: absolute;
		top: 4px;
		right: 8px;
	}
</style>
