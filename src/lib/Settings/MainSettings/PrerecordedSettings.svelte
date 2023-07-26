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
</script>

<div>
	<label>
		<p>Link to audio to sync chapters with:</p>
		<input type="url" value={enclosureUrl} on:input={handleInput} />
	</label>
</div>

<style>
	div {
		width: calc(100% - 12px);
		margin: 6px;
	}

	label {
		margin: 12px 0;
		color: var(--color-theme-blue);
	}
	label p {
		margin: 0 0 2px 0;
		padding: 0;
		font-weight: bold;
	}

	label input {
		width: calc(100% - 18px);
		padding: 6px;
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
