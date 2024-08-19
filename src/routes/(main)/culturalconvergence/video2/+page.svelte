<script>
	import SocketLoader from '../SocketLoader.svelte';
	import Video from '../Video.svelte';

	export let data;
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
