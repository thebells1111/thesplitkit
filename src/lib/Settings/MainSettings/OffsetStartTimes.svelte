<script>
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import { liveBlocks } from '$/stores';
	import TimeInputs from '$lib/TimeInputs/TimeInputs.svelte';
	let offsetTime = 0;
	let selectedOption = 'subtract';
	let showSaveModal = false;

	function handleOffset() {
		$liveBlocks = $liveBlocks.map((v) => {
			if (v.startTime) {
				v.startTime =
					selectedOption === 'subtract' ? v.startTime - offsetTime : v.startTime + offsetTime;
				v.startTime = parseFloat(v.startTime.toFixed(3));
				if (v.startTime < 0) {
					v.startTime = 0;
				}
			}
			return v;
		});
		showSaveModal = true;
		setTimeout(() => {
			showSaveModal = false;
		}, 500);
	}
</script>

<container>
	<div>
		<TimeInputs hidePlayer={true} bind:time={offsetTime} title="Offset Time" />
	</div>

	<div>
		<label>
			<input type="radio" bind:group={selectedOption} value="subtract" />
			Subtract Offset
		</label>
		<label>
			<input type="radio" bind:group={selectedOption} value="add" />
			Add Offset
		</label>
	</div>

	<div>
		<button on:click={handleOffset}>Apply Offset</button>
	</div>

	<p>
		This is used to add or subtract time from the start time on ALL of your blocks that have a start
		time.
	</p>
	<p>
		This may be useful if after editing your recorded audio you find your block start times no
		longer sync with your audio.
	</p>
</container>

{#if showSaveModal}
	<SaveModal>
		<h2>Ofsset Applied</h2>
	</SaveModal>
{/if}

<style>
	container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	div {
		width: calc(100% - 16px);
		max-width: 360px;
		display: flex;
		justify-content: space-between;
		margin: 0 8px;
	}

	div:nth-of-type(1) {
		justify-content: center;
	}

	div:nth-of-type(3) {
		margin: 8px 0;
		justify-content: center;
	}

	p {
		margin: 4px 0;
		font-weight: bold;
		text-align: center;
	}
</style>
