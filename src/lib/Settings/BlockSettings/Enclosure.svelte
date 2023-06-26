<script>
	export let block;
	export let mainUnsaved = false;

	let enclosureUrl = block?.enclosureUrl;

	async function handleEnclosureChange() {
		block.enclosureUrl = enclosureUrl;
		mainUnsaved = true;
	}
</script>

<label
	>Link to audio file
	<input type="url" bind:value={enclosureUrl} on:input={handleEnclosureChange} />
</label>
