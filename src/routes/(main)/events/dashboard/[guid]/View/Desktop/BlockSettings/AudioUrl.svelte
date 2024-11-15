<script>
	import DownloadIcon from '$lib/icons/Download.svelte';

	export let block;
	export let downloadMP3 = () => {};

	let enclosureUrl = block?.enclosureUrl;

	async function handleEnclosureChange() {
		block.enclosureUrl = enclosureUrl;
	}
</script>

<div>
	<label>
		<h4>Link to audio file</h4>
		<input type="url" bind:value={enclosureUrl} on:input={handleEnclosureChange} />
	</label>
	<button on:click={downloadMP3.bind(this, block)} class="download">
		<DownloadIcon size="27" />
	</button>
</div>

<style>
	div {
		position: relative;
	}
	label {
		display: block;
		color: var(--color-theme-blue);
		margin: 0;
	}

	h4 {
		margin: 2px 0;
	}
	input {
		margin-left: 4px;
		width: calc(100% - 36px);
		height: 21px;
	}

	button {
		background-color: hsl(0, 0%, 100%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 35px;
		width: 35px;
		margin: 0;
		border-radius: 25px;
		padding: 0;
		position: absolute;
		right: 0;
		top: 16px;
	}
</style>
