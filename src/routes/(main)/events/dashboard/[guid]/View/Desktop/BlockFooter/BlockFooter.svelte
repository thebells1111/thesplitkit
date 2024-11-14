<script>
	import Delete from '$lib/icons/Delete.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';

	export let block = null;
	export let handleDeleteBlock = () => {};
	export let handleCopyBlock = () => {};
</script>

<button-container>
	<button class="delete" on:click={handleDeleteBlock.bind(this, block)}>
		<Delete size="27" />
	</button>

	<button class="copy" on:click={handleCopyBlock.bind(this, block)}>
		<CopyIcon size="27" />
	</button>
</button-container>

<style>
	button-container {
		width: calc(100% - 16px);
		display: flex;
		margin: 4px 8px;
		justify-content: space-between;
		align-items: flex-end;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	button.delete {
		color: var(--color-text-1);
		background-color: hsl(0, 100%, 32%);
	}

	button.copy {
		background-color: var(--color-theme-blue);
	}
</style>
