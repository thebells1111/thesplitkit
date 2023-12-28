<script>
	export let showOffsetStartTimes;
</script>

<div class="edit-times">
	<label
		on:input={(e) => {
			showOffsetStartTimes = true;
			e.target.checked = false;
		}}
	>
		<p>Start Times:</p>
		<input type="checkbox" />Update all times
	</label>
</div>

<style>
	div {
		margin: 8px 0;
		width: 100%;
	}
	label {
		display: flex;
		align-items: center;
	}
	label > p {
		font-size: 1.2em;
		font-weight: bold;
		padding: 0 6px;
		color: var(--color-theme-blue);
		margin: 0;
	}

	input {
		padding: 4px;
		font-size: 1.1em;
	}
</style>
