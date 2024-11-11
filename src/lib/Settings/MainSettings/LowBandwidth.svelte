<script>
	import { mainSettings } from '$/stores';

	export let mainUnsaved;

	function handleLowBandwidth(e) {
		$mainSettings.lowBandwidth = e.target.checked;
		mainUnsaved = true;
	}
</script>

<low-bandwidth>
	<label class="checkbox">
		<h3>Low Bandwidth:</h3>
		<input type="checkbox" on:input={handleLowBandwidth} checked={$mainSettings?.lowBandwidth} />
		Disable images
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
	label > h3 {
		padding: 0 6px;
		color: var(--color-theme-blue);
		margin: 0;
	}

	input {
		padding: 4px;
		font-size: 1.1em;
	}
</style>
