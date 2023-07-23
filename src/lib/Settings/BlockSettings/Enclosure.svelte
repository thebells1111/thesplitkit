<script>
	export let block;

	let enclosureUrl = block?.enclosureUrl;

	async function handleEnclosureChange() {
		block.enclosureUrl = enclosureUrl;
	}
</script>

<label>
	<h3>Link to audio file</h3>
	<input type="url" bind:value={enclosureUrl} on:input={handleEnclosureChange} />
</label>

<style>
	label {
		color: var(--color-theme-blue);
		margin: 8px;
		width: calc(100% - 16px);
	}

	h3 {
		margin: 0;
	}
	input {
		width: calc(100% - 8px);
	}
</style>
