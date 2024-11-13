<script>
	import clone from 'just-clone';
	export let block;
	let savedBlock;

	function preventCertainInput(event) {
		// Prevent 'e' and '-' from being inputted
		if (event.key === 'e' || event.key === '-') {
			event.preventDefault();
		}
	}

	$: {
		if (block.settings.split < 0) block.settings.split = 0;
		if (block.settings.split > 100) block.settings.split = 100;
	}

	$: compareBlock(block);

	function compareBlock() {
		if (JSON.stringify(block) !== JSON.stringify(savedBlock)) {
			savedBlock = clone(block);

			if (!block.settings) {
				block.settings = { split: 95 };
			}
		}
	}
</script>

<label>
	<h3>Block Value Split</h3>
	<percent
		><input
			type="number"
			bind:value={block.settings.split}
			min="0"
			max="100"
			on:keydown={preventCertainInput}
		/>%</percent
	>
</label>

<style>
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 300px;
		margin-bottom: 4px;
	}

	h3 {
		margin: 0;
		padding: 0;
		color: var(--color-theme-blue);
	}

	percent {
		align-self: flex-end;
		min-width: 75px;
	}

	percent input {
		width: 40px;
		padding: 4px 0;
		text-align: right;
		margin: 0 8px;
	}
</style>
