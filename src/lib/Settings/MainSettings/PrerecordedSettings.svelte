<script>
	import { mainSettings } from '$/stores';
	console.log($mainSettings);

	let enclosureUrl;
	export let mainUnsaved;

	function handleInput(e) {
		$mainSettings.editEnclosure = e.target.value;
		mainUnsaved = true;
	}

	$: enclosureUrl = $mainSettings?.editEnclosure || '';

	function handleIncludeCheck(e) {
		$mainSettings.editing = $mainSettings.editing || {};
		$mainSettings.includeDefault = e.target.checked;
		mainUnsaved = true;
	}
</script>

<div>
	<label>
		<p>Link to audio to sync chapters with:</p>
		<input type="url" value={enclosureUrl} on:input={handleInput} />
	</label>
	<label class="checkbox">
		<input type="checkbox" on:input={handleIncludeCheck} checked={$mainSettings?.includeDefault} />
		<p>Include podcast block when exporting chapters and time value splits</p>
	</label>
</div>

<style>
	div {
		width: calc(100% - 16px);
		margin: 8px;
	}

	label {
		margin: 12px 0;
	}
	label p {
		margin: 0;
		padding: 0;
		font-weight: bold;
	}

	label input {
		width: calc(100% - 8px);
	}

	label.checkbox {
		display: flex;
		width: 100%;
		align-items: flex-start;
	}

	label.checkbox input {
		width: initial;
	}

	warning {
		color: red;
		text-align: center;
		font-weight: bold;
		font-size: 1.1em;
	}
</style>
