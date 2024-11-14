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
	<h4>Block Value Split</h4>
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
		color: var(--color-theme-blue);
		display: block;
		margin: 4px 0 0 0;
	}

	h4 {
		margin: 0;
		display: inline-block;
	}

	percent {
		min-width: 75px;
	}

	percent input {
		width: 40px;
		padding: 4px 0;
		text-align: right;
		margin: 0 8px;
	}
</style>
