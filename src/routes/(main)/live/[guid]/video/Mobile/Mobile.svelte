<script>
	import Roster from '../Roster.svelte';
	import Video from '../Video.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Chat from '../Chat.svelte';
	let currentScreen = 'roster';
	import { mainSettings } from '$/stores';

	function changeScreen(screenName) {
		currentScreen = screenName;
	}
</script>

<img
	class="background"
	alt="boo-background"
	src={$mainSettings?.liveBackgroundUrl
		? $mainSettings?.liveBackgroundUrl
		: '/culturalconvergence.webp'}
/>
<nav>
	<button on:click={changeScreen.bind(this, 'boostBoard')}>Boost<br /> Board</button>
	<button on:click={changeScreen.bind(this, 'video')}>Video</button>
	<button on:click={changeScreen.bind(this, 'chat')}>Chat</button>
	<button on:click={changeScreen.bind(this, 'roster')}>Boost <br /> Bands</button>
</nav>

<container>
	<div class="roster" class:show={currentScreen === 'roster'}>
		<Roster mobile />
	</div>
	<div class:show={currentScreen === 'video'}>
		<Video />
	</div>

	<div class:show={currentScreen === 'boostBoard'}>
		<BoostBoard />
	</div>
	<div class="chat" class:show={currentScreen === 'chat'}>
		<Chat />
	</div>
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
	nav {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	nav > button {
		width: 25%;
		background-color: transparent;
		box-shadow: none;
	}

	container {
		width: 100%;
		height: calc(100% - 40px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	div {
		display: none;
		width: 100%;
		height: calc(100% - 40px);
	}

	.show {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.chat {
		margin: 8px;
	}

	.roster {
		display: flex;
		flex-direction: column;
	}
</style>
