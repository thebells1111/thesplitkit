<script>
	export let small = false;
	export let value = 0;
	export let max = Infinity;
	export let min = -Infinity;
	export let blurDefault = 1;
	export let blur = async () => {
		value = value || blurDefault;
	};
	export let focus = () => {
		value = '';
	};
	export let scrollChange = () => {};
	export let disabled = false;

	function changeInput(e) {
		let i = e.target.value.toString();

		if (i.match(/[^0-9]/g)) {
			//allows only digits as input
			value = i.match(/[0-9]/g).join('');
		} else if (Number(i) > max) {
			//won't allow input to be greater than max
			value = i.split('').pop();
		}

		if (Number(value) > max) {
			// so displayed number will never be higher than single digit max number
			value = max;
		}

		value = Number(value);
	}

	function decVal() {
		value--;
		if (value < min) {
			value = max;
		}
	}

	function incVal() {
		value++;
		if (value > max) {
			value = min;
		}
	}

	function mouseScroll(e) {
		if (e.deltaY > 0) {
			decVal();
		}
		if (e.deltaY < 0) {
			incVal();
		}
		scrollChange();
	}

	function handleKeypress(e) {
		switch (e.key) {
			case 'Enter':
				e.target.blur();
				break;
			case 'ArrowDown':
				decVal();
				break;
			case 'ArrowUp':
				incVal();
				break;
		}
	}
</script>

<input
	class:small
	bind:value
	on:input={changeInput}
	on:blur={blur}
	on:focus={focus}
	on:wheel|passive={mouseScroll}
	on:keydown={handleKeypress}
	{disabled}
/>

<style>
	input {
		background: white;
		width: 41px;
		height: 24px;
		border-width: 1px;
		border-radius: 2px;
		margin: 2px 4px;
		text-align: center;
		cursor: pointer;
	}
</style>
