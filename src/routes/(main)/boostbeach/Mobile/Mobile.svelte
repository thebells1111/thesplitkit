<script>
	import Video from '../Video.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Boost from '../Boost.svelte';
	import Chat from '../Chat.svelte';
	import Instructions from '../Instructions.svelte';
	let currentScreen = 'video';
	import { mainSettings } from '$/stores';

	function changeScreen(screenName) {
		currentScreen = screenName;
	}

	export let guid;
	export let broadcastingBlock;
	export let throwConfetti;
	let showInstructions = false;
</script>

<img
	class="background"
	alt="boo-background"
	src={$mainSettings?.liveBackgroundUrl
		? $mainSettings?.liveBackgroundUrl
		: 'https://images.pexels.com/photos/10819642/pexels-photo-10819642.jpeg'}
/>
<nav>
	<button on:click={changeScreen.bind(this, 'boostBoard')}>Boost Board</button>
	<button on:click={changeScreen.bind(this, 'video')}>Video</button>
	<button on:click={changeScreen.bind(this, 'chat')}>Chat</button>
</nav>

<container>
	<div class:show={currentScreen === 'video'}>
		<Video />
	</div>

	<div class="boost-board" class:show={currentScreen === 'boostBoard'}>
		<div class="boost-board-container">
			<BoostBoard />
		</div>
		<Boost isMobile={true} {guid} {broadcastingBlock} bind:showInstructions {throwConfetti} />
	</div>
	<div class="chat" class:show={currentScreen === 'chat'}>
		<Chat />
	</div>
</container>

{#if showInstructions}
	<Instructions bind:showInstructions />
{/if}

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
		background-color: hsla(228, 16%, 70%, 0.5);
	}

	nav > button {
		width: 33%;
		background-color: transparent;
		box-shadow: none;
		color: rgb(255, 255, 255);
		padding: 12px 0;
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

	.boost-board {
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.boost-board-container {
		display: block;
		width: 300px;
	}

	.chat {
		margin: 8px;
	}

	.show {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
