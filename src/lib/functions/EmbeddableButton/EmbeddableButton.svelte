<script>
	import { onMount } from 'svelte';
	let borderRadius = 20;
	let backgroundColor = '#ffc0cb';
	let textColor = '#ffffff';
	let buttonText = 'BOOST';
	let buttonStyle = '';

	let boxShadowHorizontal = 0;
	let boxShadowVertical = 0;
	let boxShadowBlur = 3;
	let boxShadowSpread = 0;
	let boxShadowColor = '#000000';

	let borderColor = '#000000';
	let borderThickness = 0;

	export let data;

	$: console.log(data);

	const updateStyle = () => {
		buttonStyle = `background-color: ${backgroundColor}; color: ${textColor}; border-radius: ${borderRadius}px; padding: 10px 20px; text-decoration: none; display: inline-block; border: ${borderThickness}px solid ${borderColor}; box-shadow: ${boxShadowHorizontal}px ${boxShadowVertical}px ${boxShadowBlur}px ${boxShadowSpread}px ${boxShadowColor};`;
	};

	onMount(() => {
		updateStyle();
	});

	const copyToClipboard = () => {
		const el = document.createElement('textarea');
		el.value = `<a href="https://thesplitkit.com" style="${buttonStyle}">${buttonText}</a>`;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};
</script>

<div class="input-container">
	<label for="borderRadius">Border radius:</label>
	<input
		id="borderRadius"
		type="range"
		min="0"
		max="20"
		bind:value={borderRadius}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="borderColor">Border color:</label>
	<input id="borderColor" type="color" bind:value={borderColor} on:input={updateStyle} />
</div>

<div class="input-container">
	<label for="borderThickness">Border thickness:</label>
	<input
		id="borderThickness"
		type="range"
		min="0"
		max="3"
		bind:value={borderThickness}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="backgroundColor">Background color:</label>
	<input id="backgroundColor" type="color" bind:value={backgroundColor} on:input={updateStyle} />
</div>

<div class="input-container">
	<label for="textColor">Text color:</label>
	<input id="textColor" type="color" bind:value={textColor} on:input={updateStyle} />
</div>

<div class="input-container">
	<label for="buttonText">Button text:</label>
	<input id="buttonText" type="text" bind:value={buttonText} on:input={updateStyle} />
</div>

<div class="input-container">
	<label for="boxShadowHorizontal">Button shadow horizontal offset:</label>
	<input
		id="boxShadowHorizontal"
		type="range"
		min="-10"
		max="10"
		bind:value={boxShadowHorizontal}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="boxShadowVertical">Button shadow vertical offset:</label>
	<input
		id="boxShadowVertical"
		type="range"
		min="-10"
		max="10"
		bind:value={boxShadowVertical}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="boxShadowBlur">Button shadow blur radius:</label>
	<input
		id="boxShadowBlur"
		type="range"
		min="0"
		max="20"
		bind:value={boxShadowBlur}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="boxShadowSpread">Button shadow spread radius:</label>
	<input
		id="boxShadowSpread"
		type="range"
		min="0"
		max="5"
		bind:value={boxShadowSpread}
		on:input={updateStyle}
	/>
</div>

<div class="input-container">
	<label for="boxShadowColor">Button shadow color:</label>
	<input id="boxShadowColor" type="color" bind:value={boxShadowColor} on:input={updateStyle} />
</div>

<a href={'https://thesplitkit.com/' + data.guid} style={buttonStyle} target="_blank">{buttonText}</a
>
<button on:click={copyToClipboard}>Copy Button</button>

<style>
	.input-container {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}
	.input-container label {
		margin-bottom: 5px;
	}
	input[type='color'] {
		width: 40px;
		height: 20px;
		border: none;
		padding: 0;
		-webkit-appearance: none;
	}
	input[type='color']::-webkit-color-swatch-wrapper {
		padding: 0;
	}
	input[type='color']::-webkit-color-swatch {
		border: 1px solid black;
	}
	input[type='color']::-moz-color-swatch {
		border: 1px solid black;
	}
</style>
