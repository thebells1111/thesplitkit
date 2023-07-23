<script>
	import TimerIcon from '$lib/icons/Timer.svelte';
	export let time;
	export let block;
	export let title;
	export let player;

	const getHours = (t) => Math.floor(t / 3600) || 0;
	const getMinutes = (t) => Math.floor((t % 3600) / 60) || 0;
	const getSeconds = (t) => Math.floor(t) % 60 || 0;
	const getMilliseconds = (t) => Math.round((t % 1) * 1000) || 0;

	const updateAdded = (type, value) => {
		let h = getHours(time);
		let m = getMinutes(time);
		let s = getSeconds(time);
		let ms = getMilliseconds(time);

		if (type === 'hours') {
			h = parseInt(value);
		} else if (type === 'minutes') {
			m = parseInt(value);
		} else if (type === 'seconds') {
			s = parseInt(value);
		} else if (type === 'milliseconds') {
			ms = parseInt(value);
		}

		time = h * 3600 + m * 60 + s + ms / 1000;
		block = block;
	};

	function handleMarkTime() {
		time = player.currentTime;
		block = block;
	}
</script>

<time-container>
	<title-bar>
		<h3>{title}</h3>
		{#if player}
			<button class="timer" on:click={handleMarkTime}><TimerIcon size="32" /></button>
		{/if}
	</title-bar>

	<time-inputs>
		<label>
			Hour
			<input
				type="number"
				value={getHours(time)}
				on:input={(e) => updateAdded('hours', e.target.value)}
				min="0"
			/>
		</label>
		<label>
			Min
			<input
				type="number"
				value={getMinutes(time)}
				on:input={(e) => updateAdded('minutes', e.target.value)}
				min="0"
				max="59"
			/>
		</label>
		<label>
			Sec
			<input
				type="number"
				value={getSeconds(time)}
				on:input={(e) => updateAdded('seconds', e.target.value)}
				min="0"
				max="59"
			/>
		</label>
		<label>
			mSec
			<input
				type="number"
				value={getMilliseconds(time)}
				on:input={(e) => updateAdded('milliseconds', e.target.value)}
				min="0"
				max="999"
			/>
		</label>
	</time-inputs>
</time-container>

<style>
	time-container {
		margin: 0 8px;
		width: calc(100% - 16px);
	}

	title-bar {
		display: flex;
		align-items: center;
		margin: 4px 0;
	}
	h3 {
		margin: 4px 8px 0 0;
		color: var(--color-theme-blue);
		display: inline-block;
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

	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		width: 40px;
		margin-left: 8px;
		border-radius: 25px;
		padding: 0;
	}

	button.timer {
		color: hsl(278, 100%, 92%);
		background-color: hsl(277, 100%, 44%);
	}
</style>
