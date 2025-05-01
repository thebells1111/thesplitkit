<script>
	import Roster from './Roster.svelte';
	import Video from '../Video.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Chat from '../Chat.svelte';
	import Instructions from '../Instructions.svelte';
	let currentScreen = 'roster';
	import { mainSettings } from '$/stores';

	function changeScreen(screenName) {
		currentScreen = screenName;
	}

	export let guid;
	export let broadcastingBlock;
	export let controlGuid;
	let showInstructions = false;
</script>

<img
	class="background"
	alt="boo-background"
	src={$mainSettings?.liveBackgroundUrl
		? $mainSettings?.liveBackgroundUrl
		: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/sproutingsymphonies/art/spring-arrangement-twigs-with-tree-flowers.jpg'}
/>
<nav>
	<button on:click={changeScreen.bind(this, 'boostBoard')}>Boost<br /> Board</button>
	<button on:click={changeScreen.bind(this, 'video')}>Video</button>
	<button on:click={changeScreen.bind(this, 'chat')}>Chat</button>
	<button on:click={changeScreen.bind(this, 'roster')}>Boost <br /> Bands</button>
</nav>

<container>
	<div class="roster" class:show={currentScreen === 'roster'}>
		<Roster {guid} {controlGuid} {broadcastingBlock} bind:showInstructions />
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

		background-color: hsla(20, 39%, 88%, 0.5);
	}

	nav > button {
		width: 25%;
		background-color: transparent;
		box-shadow: none;
		color: rgb(67, 1, 9);
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
		flex-direction: column;
	}
</style>
