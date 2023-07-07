<script>
	import { onMount } from 'svelte';

	let index = 1;
	const MAX_INDEX = 36;
	let imgInput;

	$: src = `./tuts/tut${index}.jpg`;

	function goBack() {
		index = index === 1 ? MAX_INDEX : index - 1;
	}

	function goForward() {
		index = index === MAX_INDEX ? 1 : index + 1;
	}

	function validateInput() {
		let value = parseInt(imgInput.value, 10);

		if (isNaN(value) || value <= 0) {
			imgInput.value = index;
		} else if (value > MAX_INDEX) {
			imgInput.value = MAX_INDEX;
			index = MAX_INDEX;
		} else {
			index = value;
		}
	}

	onMount(() => {
		imgInput.addEventListener('blur', validateInput);
		return () => {
			imgInput.removeEventListener('blur', validateInput);
		};
	});
</script>

<div>
	<img {src} />
</div>
<tab-control>
	<button on:click={goBack}>&larr;</button>
	<input bind:this={imgInput} type="number" min="1" max={MAX_INDEX} bind:value={index} />
	<span>of {MAX_INDEX}</span>
	<button on:click={goForward}>&rarr;</button>
</tab-control>

<style>
	div {
		height: calc(100% - 50px);

		width: 100%;
		background-color: antiquewhite;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		overflow: hidden;
	}
	img {
		margin-top: 8px;
		width: calc(100% - 16px);
		max-width: 360px;
		max-height: calc(100% - 16px);
		object-fit: cover;
		overflow: hidden;
		border-radius: 8px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
	}
</style>
