<script>
	import SocketLoader from '../SocketLoader.svelte';
	import Video from '../Video.svelte';

	export let data = {
		video1: '',
		video2: '',
		poll: '',
		boostBoard: '',
		chat: ''
	};
</script>

<SocketLoader bind:data />

<screen>
	<Video bind:src={data.video2} />
</screen>

<style>
	screen {
		height: 100%;
		width: 100%;
	}
</style>
