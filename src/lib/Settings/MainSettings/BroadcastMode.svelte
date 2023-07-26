<script>
	import { mainSettings } from '$/stores';
	export let mainUnsaved;
	let selectedOption = $mainSettings?.broadcastMode || 'manual'; // Default selected option

	// Function to handle the option change
	function handleChange(event) {
		selectedOption = event.target.value;
		$mainSettings.broadcastMode = selectedOption;
		mainUnsaved = true;
	}
</script>

<div class="broadcast-mode">
	<label for="broadcast-select">Broadcast Mode: </label>
	<select id="broadcast-select" bind:value={selectedOption} on:change={handleChange}>
		<option value="manual">Manual</option>
		<option value="playlist">Playlist</option>
		<option value="podcast">Podcast</option>
		<option value="edit">Prerecorded Audio</option>
	</select>
</div>

<style>
	div {
		margin: 8px 0;
		width: 100%;
	}
	label {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 6px;
		color: var(--color-theme-blue);
	}

	select {
		padding: 4px;
		font-size: 1.1em;
	}
</style>
