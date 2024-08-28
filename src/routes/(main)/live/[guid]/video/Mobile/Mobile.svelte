<script>
	import Roster from '../Roster.svelte';
	import Video from '../Video.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Chat from '../Chat.svelte';
	let currentScreen = 'roster';

	function changeScreen(screenName) {
		currentScreen = screenName;
	}
</script>

<img class="background" alt="boo-background" src="/culturalconvergence.webp" />
<nav>
	<button on:click={changeScreen.bind(this, 'boostBoard')}>Boost<br /> Board</button>
	<button on:click={changeScreen.bind(this, 'video')}>Video</button>
	<button on:click={changeScreen.bind(this, 'chat')}>Chat</button>
	<button on:click={changeScreen.bind(this, 'roster')}>Boost <br /> Bands</button>
</nav>

<container>
	{#if currentScreen === 'roster'}
		<Roster />
	{:else if currentScreen === 'video'}
		<Video />
	{:else if currentScreen === 'boostBoard'}
		<BoostBoard />
	{:else if currentScreen === 'chat'}
		<Chat />
	{/if}
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
</style>
