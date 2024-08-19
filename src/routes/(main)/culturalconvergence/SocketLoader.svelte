<script>
	import { onMount } from 'svelte';
	import { remoteServer } from '$/stores';
	import io from 'socket.io-client';

	export let data = {
		video1: '',
		video2: '',
		poll: '',
		boostBoard: '',
		chat: ''
	};

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
