<script>
	import Roster from './Roster.svelte';
	import Video from './Video.svelte';
	import Chat from './Chat.svelte';
</script>

<img class="background" alt="boo-background" src="/boo-background.jpg" />

<container>
	<top>
		<Video />
		<Chat />
	</top>
	<bottom>
		<Roster />
	</bottom>
</container>

<style>
	.background {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		object-fit: cover;
		z-index: -1;
	}

	container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	top {
		flex-grow: 1;
		display: flex;
		margin: 16px;
	}
	bottom {
		max-height: 160px;
		overflow-y: hidden;
		margin: 0 8px 8px 8px;
	}
</style>
