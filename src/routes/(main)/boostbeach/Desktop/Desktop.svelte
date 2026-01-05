<script>
	import Boost from './Boost.svelte';
	import Video from '../Video.svelte';
	import Chat from '../Chat.svelte';
	import BoostBoard from '../BoostBoard.svelte';
	import Instructions from '../Instructions.svelte';
	import { mainSettings } from '$/stores';
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

<container>
	<div class="middle">
		<BoostBoard />
		<Boost {guid} {broadcastingBlock} bind:showInstructions {throwConfetti} />
	</div>

	<Video />

	<Chat />
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
		height: calc(100% - 16px);
		width: calc(100% - 16px);
		margin: 8px;
		overflow: hidden;
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		grid-template-rows: 1fr;
		grid-column-gap: 8px;
		grid-row-gap: 0px;
	}

	.middle {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 100px;
		grid-column-gap: 8px;
		grid-row-gap: 0px;
	}
</style>
