<script>
	import { mainSettings } from '$/stores';

	export let updateAllSplits = false;
	export let mainUnsaved = false;

	$: {
		if ($mainSettings.splits < 0) $mainSettings.splits = 0;
		if ($mainSettings.splits > 100) $mainSettings.splits = 100;
		if (!Number($mainSettings.splits)) {
			$mainSettings.splits = 95;
		}
	}

	function preventCertainInput(event) {
		// Prevent 'e' and '-' from being inputted
		if (event.key === 'e' || event.key === '-') {
			event.preventDefault();
		}
	}
</script>

<default-split>
	<h3>Default value split for new blocks:</h3>
	<split-container>
		<percent>
			<input
				type="number"
				bind:value={$mainSettings.splits}
				min="0"
				max="100"
				on:keydown={preventCertainInput}
			/> %
		</percent>
		<label>
			<input
				type="checkbox"
				bind:value={updateAllSplits}
				on:input={() => (mainUnsaved = true)}
			/>Update all splits
		</label>
	</split-container>
	<p>The other {100 - Number($mainSettings.splits)}% goes to your default block.</p>
</default-split>

<style>
	default-split {
		margin: 6px;

		width: 100%;
	}
	split-container {
		display: flex;
		width: 320px;
		justify-content: space-between;
		align-items: center;
	}
	p,
	h3 {
		margin: 0;
		padding: 0 6px;
		font-weight: bold;
	}

	h3 {
		color: var(--color-theme-blue);
	}

	split-container label {
		margin-right: 16px;
	}

	percent {
		align-self: flex-end;
		margin: 4px 6px;
	}

	percent input {
		width: 50px;
		padding: 4px;
		text-align: right;
	}
</style>
