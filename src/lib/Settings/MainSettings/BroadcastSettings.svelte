<script>
	import { mainSettings } from '$/stores';
	$: console.log($mainSettings);
	let chaptersEnabled = $mainSettings?.chaptersEnabled || false;
	let VTSEnabled = $mainSettings?.VTSEnabled || false;
	let timeRemainingEnabled = $mainSettings?.timeRemainingEnabled || false;

	function handleChaptersEnable() {
		chaptersEnabled = !chaptersEnabled;
		if (chaptersEnabled) {
			$mainSettings.chaptersEnabled = chaptersEnabled;
		} else {
			$mainSettings.chaptersEnabled = false;
		}
	}

	function handleVTSEnable() {
		VTSEnabled = !VTSEnabled;
		if (VTSEnabled) {
			$mainSettings.VTSEnabled = VTSEnabled;
		} else {
			$mainSettings.VTSEnabled = false;
		}
	}

	function handleTimeRemainingEnable() {
		timeRemainingEnabled = !timeRemainingEnabled;
		if (timeRemainingEnabled) {
			$mainSettings.timeRemainingEnabled = timeRemainingEnabled;
		} else {
			$mainSettings.timeRemainingEnabled = false;
		}
	}
</script>

<div>
	<p>Broadcast Options:</p>
	<label>
		<input type="checkbox" on:change={handleChaptersEnable} bind:checked={chaptersEnabled} />
		Broadcast Chapter Changes from Active Block
	</label>
	<label>
		<input type="checkbox" on:change={handleVTSEnable} bind:checked={VTSEnabled} />
		Broadcast Time Split Changes from Active Block
	</label>
	<label>
		<input
			type="checkbox"
			on:change={handleTimeRemainingEnable}
			bind:checked={timeRemainingEnabled}
		/>
		Broadcast Time Remaining from Active Block
	</label>
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
