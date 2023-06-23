<script>
	import PreviewIcon from '$lib/icons/Preview.svelte';
	import Save from '$lib/icons/Save.svelte';
	export let showPreview;
	export let unsaved = false;
	export let block = {};
	export let saveState = () => {};
</script>

<sidebar>
	<button
		on:click={() => {
			showPreview = true;
		}}
	>
		<PreviewIcon size="32" />
	</button>

	<button
		class="save"
		type="submit"
		disabled={!unsaved}
		on:click={() => {
			saveState(block);
			unsaved = false;
		}}
	>
		<Save size="32" />
	</button>
</sidebar>

<style>
	sidebar {
		display: flex;
		justify-content: space-between;
		position: absolute;
		left: 0;
		top: 0;
	}

	sidebar button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px 8px 4px 4px;
		height: 40px;
		width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	button:disabled {
		color: rgb(206, 206, 206);
		cursor: not-allowed;
		filter: none;
		background-color: hsl(0, 0%, 94%);
	}

	@media screen and (min-width: 420px) {
		sidebar {
			left: calc(50% - 190px);
		}
	}
</style>
