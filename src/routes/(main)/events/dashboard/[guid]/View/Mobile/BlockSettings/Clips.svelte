<script>
	import TimeInputs from './TimeInputs.svelte';
	export let block;
	let player;

	function handleClipping(e) {
		if (e.target.checked) {
			block.soundBite = {
				startTime: 0,
				endTime: block.duration || 0,
				duration: block.duration || 0
			};
		} else {
			delete block.soundBite;
		}
		block = block;
	}

	$: if (block?.soundBite?.startTime > -1 && block?.soundBite?.endTime > -1) {
		let duration = block?.soundBite?.endTime - block?.soundBite?.startTime;
		block.soundBite.duration = duration > 0 ? duration : 0;
	}
</script>

<div>
	<label>
		<input type="checkbox" on:change={handleClipping} checked={block.soundBite} />
		<h3>Enable Sound Bite Clipping</h3>
	</label>

	{#if block?.soundBite}
		<TimeInputs bind:block bind:time={block.soundBite.startTime} title="Clip Start" bind:player />

		<TimeInputs bind:block bind:time={block.soundBite.endTime} title="Clip End" bind:player />
		<audio bind:this={player} controls src={block.enclosureUrl} />
	{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		margin: 8px 0;
	}

	label {
		color: var(--color-theme-blue);
		margin-bottom: 8px;
	}

	h3 {
		margin: 0;
		display: inline-block;
	}

	audio {
		margin-top: 8px;
		width: 100%;
	}
</style>
