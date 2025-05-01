<script>
	import Roster from './Roster.svelte';
	import Video from '../Video.svelte';
	import Chat from '../Chat.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Instructions from '../Instructions.svelte';
	import { mainSettings } from '$/stores';
	export let guid;
	export let broadcastingBlock;
	let showInstructions = false;
</script>

<img
	class="background"
	alt="boo-background"
	src={$mainSettings?.liveBackgroundUrl
		? $mainSettings?.liveBackgroundUrl
		: 'https://music.behindthesch3m3s.com/wp-content/uploads/Sat_Skirmish/sproutingsymphonies/art/spring-arrangement-twigs-with-tree-flowers.jpg'}
/>

<container>
	<top>
		<BoostBoard />
		<Video />
		<Chat />
	</top>
	<bottom>
		<Roster {guid} {broadcastingBlock} bind:showInstructions />
	</bottom>
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
		background-color: black;
	}

	container {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	top {
		display: flex;
		flex-grow: 1;
		margin: 16px;
		overflow: hidden;
	}

	top {
		flex-grow: 1;
		overflow: hidden;
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		grid-template-rows: 1fr;
		grid-column-gap: 8px;
		grid-row-gap: 0px;
	}
	bottom {
		min-height: 180px;
		overflow-y: hidden;
		margin: 0 8px 8px 8px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
