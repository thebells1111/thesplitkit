<script>
	import TimerIcon from '$lib/icons/Timer.svelte';
	import NumberInput from './NumberInput.svelte';
	export let time = null;
	export let block = null;
	export let title = null;
	export let player = null;
	export let hidePlayer = null;
	export let small = false;

	const getHours = (t) => Math.floor(t / 3600) || 0;
	const getMinutes = (t) => Math.floor((t % 3600) / 60) || 0;
	const getSeconds = (t) => Math.floor(t) % 60 || 0;
	const getMilliseconds = (t) => Math.round((t % 1) * 1000) || 0;

	let hour = getHours(time);
	let mins = getMinutes(time);
	let sec = getSeconds(time);
	let msec = getMilliseconds(time);

	$: if (hour > -1 && mins > -1 && sec > -1 && msec > -1) {
		time = hour * 3600 + mins * 60 + sec + msec / 1000;
	}

	function handleMarkTime() {
		time = player.currentTime;
		block = block;
		hour = getHours(time);
		mins = getMinutes(time);
		sec = getSeconds(time);
		msec = getMilliseconds(time);
	}
</script>

<time-container>
	<title-bar>
		<h4>{title}</h4>
		{#if player && !hidePlayer}
			<button class="timer" on:click={handleMarkTime}><TimerIcon size="32" /></button>
		{/if}
	</title-bar>

	<time-inputs>
		<label>
			Hour
			<NumberInput max={99} min={0} bind:value={hour} blurDefault={0} {small} />
		</label>
		<label>
			Min
			<NumberInput max={59} min={0} bind:value={mins} blurDefault={0} {small} />
		</label>
		<label>
			Sec
			<NumberInput max={59} min={0} bind:value={sec} blurDefault={0} {small} />
		</label>
		<label>
			mSec
			<NumberInput max={999} min={0} bind:value={msec} blurDefault={0} {small} />
		</label>
	</time-inputs>
</time-container>

<style>
	time-container {
		margin: 0;
		width: 100%;
	}

	title-bar {
		display: flex;
		align-items: center;
		margin: 4px 0;
	}
	h4 {
		margin: 0;
		color: var(--color-theme-blue);
		display: inline-block;
	}
	time-inputs {
		display: flex;
		justify-content: flex-start;
		width: 100%;
	}

	time-inputs label {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
