<script>
	import { mainSettings } from '$/stores';

	export let updateAllSplits = false;
	export let mainUnsaved = false;

	$: {
		if ($mainSettings.splits < 0) $mainSettings.splits = 0;
		if ($mainSettings.splits > 100) $mainSettings.splits = 100;
	}

	function preventCertainInput(event) {
		// Prevent 'e' and '-' from being inputted
		if (event.key === 'e' || event.key === '-') {
			event.preventDefault();
		}
	}
</script>

<default-split>
	<p>Default value split for active block:</p>
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
</default-split>

<style>
	default-split {
		margin: 4px;
	}
	split-container {
		display: flex;
		width: 280px;
		justify-content: space-between;
		align-items: center;
	}
	p {
		margin: 0;
		padding: 0;
		font-weight: bold;
		text-align: center;
	}

	split-container label {
		margin-right: 16px;
	}

	percent {
		align-self: flex-end;
		margin-left: 16px;
	}

	percent input {
		width: 50px;
		padding: 4px;
		text-align: right;
	}
</style>
