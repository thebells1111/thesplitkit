<script>
	import { mainSettings } from '$/stores';

	function handleLowBandwidth(e, setting) {
		$mainSettings.lowBandwidth = $mainSettings?.lowBandwidth || {};
		$mainSettings.lowBandwidth[setting] = e.target.checked;
	}
</script>

<low-bandwidth>
	<h3>Low Bandwidth:</h3>
	<label class="checkbox">
		<input
			type="checkbox"
			on:input={(e) => handleLowBandwidth(e, 'images')}
			checked={$mainSettings?.lowBandwidth?.images}
		/>
		Disable images
	</label>
	<label class="checkbox">
		<input
			type="checkbox"
			on:input={(e) => handleLowBandwidth(e, 'audio')}
			checked={$mainSettings?.lowBandwidth?.audio}
		/>
		Disable mp3 download
	</label>
</low-bandwidth>

<style>
	low-bandwidth {
		display: block;
		margin: 8px 0;
		width: 100%;
	}
	label {
		display: flex;
		align-items: center;
	}
	h3 {
		padding: 0 6px;
		color: var(--color-theme-blue);
		margin: 0;
	}

	input {
		padding: 4px;
		font-size: 1.1em;
	}
</style>
