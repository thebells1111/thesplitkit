<script>
	import { mainSettings } from '$/stores';
	console.log($mainSettings);

	let enclosureUrl;
	export let mainUnsaved;

	function handleInput(e) {
		$mainSettings.liveEnclosure = e.target.value;
		mainUnsaved = true;
	}

	$: enclosureUrl = $mainSettings?.liveEnclosure || '';

	function handleAutoSwitch(e) {
		$mainSettings.podcast = $mainSettings.podcast || {};
		$mainSettings.podcast.autoSwitch = e.target.checked;
		mainUnsaved = true;
	}

	function handleIncludeCheck(e) {
		$mainSettings.podcast = $mainSettings.podcast || {};
		$mainSettings.includeDefault = e.target.checked;
		mainUnsaved = true;
	}
</script>

<div>
	<label>
		<p>Link to Live Audio:</p>
		<input type="url" value={enclosureUrl} on:input={handleInput} />
	</label>
	<label class="checkbox">
		<input
			type="checkbox"
			on:input={handleAutoSwitch}
			checked={$mainSettings?.podcast?.autoSwitch}
		/>
		<p>Automatically Broadcast Default Podcast when Active Block ends.</p>
	</label>
	<label class="checkbox">
		<input type="checkbox" on:input={handleIncludeCheck} checked={$mainSettings?.includeDefault} />
		<p>Include podcast block when exporting chapters and time value splits (not recommended)</p>
	</label>

	<warning>
		<p>
			When Auto Broadcast is enabled, any block without a duration will be unable to auto broadcast.
		</p>
	</warning>
</div>

<style>
	div {
		width: calc(100% - 16px);
		margin: 0 8px;
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