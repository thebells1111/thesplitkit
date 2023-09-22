<script>
	import Close from '$lib/icons/Close.svelte';
	export let showModal;
	export let unsaved = false;
	export let onClose = () => {};
	function closeModal() {
		onClose();
		if (unsaved) {
			const userConfirmation = window.confirm('Your changes are unsaved. Do you want to continue?');
			if (userConfirmation) {
				showModal = false;
				unsaved = false;
			}
		} else {
			showModal = false;
		}
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<modal>
		<button class="close icon" on:click={closeModal}>
			<Close size="24" />
		</button>
		<modal-content>
			<slot />
		</modal-content>
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
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	modal {
		display: block;
		position: relative;
		width: calc(100% - 56px);
		max-width: 960px;
		overflow: hidden;
		border-radius: 8px;
		background-color: white;

		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 1);
		height: calc(100% - 56px);
		min-height: 400px;
		max-height: calc(100svh - 32px);
	}

	modal-content {
		display: block;
		overflow: auto;
		height: calc(100% - 60px);
		margin-top: 40px;
		padding: 0 20px 20px 20px;
	}

	.close {
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(0, 0, 0, 0.75);
		z-index: 33;
		border: 1px solid transparent;
	}
</style>
