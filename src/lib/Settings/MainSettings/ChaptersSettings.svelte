<script>
	import { mainSettings } from '$/stores';
	console.log($mainSettings);

	let enclosureUrl;
	export let mainUnsaved;

	function handleInput(e) {
		$mainSettings.chapterEnclosure = e.target.value;
		mainUnsaved = true;
	}

	$: enclosureUrl = $mainSettings?.chapterEnclosure || '';
</script>

<label>
	Link to audio to sync chapters with:
	<input type="url" value={enclosureUrl} on:input={handleInput} />
</label>
