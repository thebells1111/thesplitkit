<script>
	import SocketLoader from './SocketLoader.svelte';
	import Video from './Video.svelte';
	import Chat from './Chat.svelte';

	let data = {
		video1: '',
		video2: '',
		poll: '',
		boostBoard: '',
		chat: ''
	};
</script>

<SocketLoader bind:data />

<top-pane>
	<screen-1>
		<Video src={data.video1} />
	</screen-1>
	<screen-2>
		<Video src={data.video2} />
	</screen-2>
</top-pane>

<bottom-pane>
	<screen>
		<stuff>
			<h1>{data.boostBoard || 'Boost Board'}</h1>
		</stuff>
	</screen>
	<screen>
		<stuff>
			<h1>{data.poll || 'Poll'}</h1>
		</stuff>
	</screen>
	<screen>
		<stuff>
			<Chat src={data.chat} />
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

	stuff {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
