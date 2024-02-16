<script>
	import { mainSettings } from '$/stores';
	$: console.log($mainSettings);
	let loopEnabled = $mainSettings?.playlist?.loop || false;
	let randomEnabled = $mainSettings?.playlist?.random || false;

	function handleLoopEnable() {
		loopEnabled = !loopEnabled;
		$mainSettings.playlist = $mainSettings.playlist || {};
		if (loopEnabled) {
			$mainSettings.playlist.loopEnabled = loopEnabled;
		} else {
			$mainSettings.playlist.loopEnabled = false;
		}
	}

	function handleRandomEnable() {
		randomEnabled = !randomEnabled;
		$mainSettings.playlist = $mainSettings.playlist || {};
		if (randomEnabled) {
			$mainSettings.playlist.randomEnabled = randomEnabled;
		} else {
			$mainSettings.playlist.randomEnabled = false;
		}
	}
</script>

<div>
	<p>Playback Options:</p>
	<label>
		<input type="checkbox" on:change={handleLoopEnable} bind:checked={loopEnabled} />
		Loop Blocks
	</label>
	<!-- <label>
		<input type="checkbox" on:change={handleRandomEnable} bind:checked={randomEnabled} />
		Randomize Blocks
	</label> -->
</div>

<style>
	div {
		margin: 8px 0;
		width: 100%;
	}
	p {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 6px;
		color: var(--color-theme-blue);
		margin: 0;
	}

	input {
		margin: 0 6px;
	}
	label {
		display: block;
		margin: 8px;
	}
</style>
