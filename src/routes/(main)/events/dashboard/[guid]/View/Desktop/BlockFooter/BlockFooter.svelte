<script>
	import ValueBlock from '$lib/ValueBlock/ValueBlock.svelte';
	import Modal from '$lib/Modal/Modal.svelte';

	import Delete from '$lib/icons/Delete.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import { defaultBlockGuid } from '$/stores';

	export let block = null;
	export let handleDeleteBlock = () => {};
	export let handleCopyBlock = () => {};

	let showValueModal;

	const calculateTotalPercentage = () => {
		block.settings.totalPercentage = block.value.destinations.reduce(
			(acc, person) => acc + parseFloat(person.split || 0),
			0
		);
	};
</script>

<button-container>
	<button class="delete" on:click={handleDeleteBlock.bind(this, block)}>
		<Delete size="27" />
	</button>

	<button
		class="value"
		on:click={() => {
			showValueModal = true;
			calculateTotalPercentage();
		}}
	>
		edit value block
	</button>

	<button class="copy" on:click={handleCopyBlock.bind(this, block)}>
		<CopyIcon size="27" />
	</button>
</button-container>

{#if showValueModal}
	<Modal bind:showModal={showValueModal}>
		<ValueBlock bind:data={block} {calculateTotalPercentage} />
	</Modal>
{/if}

<style>
	button-container {
		width: calc(100% - 16px);
		display: flex;
		margin: 4px 8px;
		justify-content: space-between;
		align-items: flex-end;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 4px;
		min-height: 40px;
		min-width: 40px;
		border-radius: 25px;
		padding: 0;
	}

	button.delete {
		color: var(--color-text-1);
		background-color: hsl(0, 100%, 32%);
	}

	button.copy {
		background-color: var(--color-theme-blue);
	}

	button.value {
		color: hsl(278, 100%, 92%);
		background-color: hsl(277, 100%, 44%);
		width: 150px;
		min-height: initial;
		height: initial;
		margin: 0 0 8px 8px;
	}
</style>
