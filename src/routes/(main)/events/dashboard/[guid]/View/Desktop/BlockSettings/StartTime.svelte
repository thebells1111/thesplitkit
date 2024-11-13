<script>
	export let block = {};

	const getHours = (t) => Math.floor(t / 3600) || 0;
	const getMinutes = (t) => Math.floor((t % 3600) / 60) || 0;
	const getSeconds = (t) => Math.floor(t) % 60 || 0;
	const getMilliseconds = (t) => Math.round((t % 1) * 1000) || 0;

	const updateAdded = (type, value, item) => {
		let h = getHours(item.startTime);
		let m = getMinutes(item.startTime);
		let s = getSeconds(item.startTime);
		let ms = getMilliseconds(item.startTime);

		if (type === 'hours') {
			h = parseInt(value);
		} else if (type === 'minutes') {
			m = parseInt(value);
		} else if (type === 'seconds') {
			s = parseInt(value);
		} else if (type === 'milliseconds') {
			ms = parseInt(value);
		}

		block.startTime = h * 3600 + m * 60 + s + ms / 1000;
	};
</script>

<time-container>
	<h3>Start Time</h3>

	<time-inputs>
		<label>
			Hour
			<input
				type="number"
				value={getHours(block.startTime)}
				on:input={(e) => updateAdded('hours', e.target.value, block)}
				min="0"
			/>
		</label>
		<label>
			Min
			<input
				type="number"
				value={getMinutes(block.startTime)}
				on:input={(e) => updateAdded('minutes', e.target.value, block)}
				min="0"
				max="59"
			/>
		</label>
		<label>
			Sec
			<input
				type="number"
				value={getSeconds(block.startTime)}
				on:input={(e) => updateAdded('seconds', e.target.value, block)}
				min="0"
				max="59"
			/>
		</label>
		<label>
			mSec
			<input
				type="number"
				value={getMilliseconds(block.startTime)}
				on:input={(e) => updateAdded('milliseconds', e.target.value, block)}
				min="0"
				max="999"
			/>
		</label>
	</time-inputs>
</time-container>

<style>
	time-container {
		margin: 8px;
		width: calc(100% - 16px);
	}
	h3 {
		margin: 4px 0 0 0;
		margin: 4px 0 0 0;
		color: var(--color-theme-blue);
	}
	time-inputs {
		display: flex;
	}

	time-inputs label {
		display: flex;
		flex-direction: column;
		font-weight: bold;
		width: 60px;
		margin: 0 8px;
		justify-content: center;
		align-items: center;
	}

	time-inputs label input {
		width: 60%;
		text-align: center;
		padding: 4px;
	}
</style>
