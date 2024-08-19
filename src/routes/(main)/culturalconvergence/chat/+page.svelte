<script>
	import SocketLoader from '../SocketLoader.svelte';
	import Chat from '../Chat.svelte';

	export let data;
</script>

<SocketLoader bind:data />

<screen>
	<Chat bind:src={data.chat} />
</screen>

<style>
	screen {
		display: block;
		height: 100%;
		width: 100%;
	}
</style>
