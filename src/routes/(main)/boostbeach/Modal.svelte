<script>
	import { onMount } from 'svelte';
	import Close from '$lib/icons/Close.svelte';

	export let closeModal = () => {};
	export let showModal = false;
	export let imgSrc;
	export let width;
	export let height;
	export let backgroundColor;

	onMount(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	});

	function onClose() {
		closeModal();

		showModal = false;
	}
</script>

<blurred-background on:mousedown|self={onClose} on:touchend|self={onClose}>
	<modal
		style={`
			${
				imgSrc
					? `background-image: url('${imgSrc}'); background-size: cover; background-position: center;`
					: ''
			}
			${width ? `width: ${width};` : ''}
			${height ? `height: ${height};` : ''}
			${backgroundColor ? `background-color: ${backgroundColor};` : ''}
		`}
	>
		<button class="close" on:click={onClose}>
			<Close size="24" />
		</button>

		<container>
			<slot />
		</container>
	</modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 100;
		backdrop-filter: blur(5px);
	}

	modal {
		display: block;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 5px 10px 2px rgba(0, 0, 0, 0.75);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;

		background: rgba(0, 0, 0, 0.8);
		padding: 25px;
		text-align: center;
		width: 100%;
		max-width: 992px;
		border-radius: 16px;
		border: 2px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(10px);
	}

	button {
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		height: 50px;
		position: absolute;
	}

	container {
		display: block;
		margin-top: 58px;
		width: 100%;
		height: calc(100% - 58px);
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		z-index: 33;
		border: 1px solid transparent;
		box-shadow: none;
	}

	@media screen and (max-width: 992px) {
		modal {
			position: relative;
			width: 100%;
			height: 100%;
			overflow-y: auto;
			overflow-x: hidden;
			border-radius: 0;
		}
	}
</style>
