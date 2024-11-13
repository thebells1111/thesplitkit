<script>
	export let block;

	let enclosureUrl = block?.enclosureUrl;

	async function handleEnclosureChange() {
		block.enclosureUrl = enclosureUrl;
	}
</script>

<label>
	<h4>Link to audio file</h4>
	<input type="url" bind:value={enclosureUrl} on:input={handleEnclosureChange} />
</label>

<style>
	label {
		display: block;
		color: var(--color-theme-blue);
		margin: 0;
	}

	h4 {
		margin: 2px 0;
	}
	input {
		width: calc(100% - 8px);
	}
</style>
