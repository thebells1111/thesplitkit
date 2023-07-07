<script>
	import { onMount } from 'svelte';

	let index = 1;
	const MAX_INDEX = 35;
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
		position: relative;
		padding: 8px; /* This will effectively make the available space 16px less than the parent's width and height */
		box-sizing: border-box; /* This makes sure that padding is included in the div's total width and height */
		width: 100%;
		height: calc(100% - 50px);
		display: flex;
		justify-content: center;
	}

	div > img {
		max-width: 360px;
		max-height: 100%;
		width: calc(100% - 16px);
		height: auto;
		object-fit: contain; /* This property specifies how the image should be resized to fit its container while maintaining its aspect ratio */
		border-radius: 8px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
	}
</style>
