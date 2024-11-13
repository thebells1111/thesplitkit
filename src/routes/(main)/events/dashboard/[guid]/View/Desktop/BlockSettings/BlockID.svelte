<script>
	import CopyIcon from '$lib/icons/Copy.svelte';
	export let block;

	async function copyToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				alert('ID copied to clipboard');
			})
			.catch((err) => {
				alert('Error copying ID to clipboard');
			});
	}
</script>

<block-id on:click={copyToClipboard.bind(this, block.blockGuid)}>
	<div>
		<h4>Block ID</h4>

		<p>{block.blockGuid}</p>
		<CopyIcon size="14" />
	</div>
</block-id>

<style>
	block-id {
		display: block;
		margin: 2px 0;
		cursor: copy;
	}

	h4 {
		color: var(--color-theme-blue);
		margin: 0;
		display: inline-block;
	}

	block-id > div > p {
		display: inline;
	}

	block-id > p {
		font-size: 0.8em;
	}
</style>
