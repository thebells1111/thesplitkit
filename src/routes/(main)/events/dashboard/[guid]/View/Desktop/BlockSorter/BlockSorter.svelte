<script>
	import Sortable from 'sortablejs';
	import { onMount } from 'svelte';
	import { defaultBlockGuid } from '$/stores';

	export let blocks = [];

	function handleSort(e) {
		const { oldIndex, newIndex } = e;
		console.log(oldIndex);
		console.log(newIndex);

		// Move the item in the array if it's not the first item
		if (oldIndex !== newIndex) {
			const movedItem = blocks.splice(oldIndex, 1)[0];
			blocks.splice(newIndex, 0, movedItem);
		}

		blocks.forEach((block, i) => {
			block.settings = block.settings || {};
			block.settings.default = false;
			if (i === 0) {
				block.settings.default = true;
			}
		});
		console.log('Sorted items:', blocks);
	}

	let foo;

	onMount(() => {
		Sortable.create(foo, {
			group: {
				name: 'foo',
				put: true,
				pull: false
			},
			animation: 200,
			handle: '.sortable-item', // Allows items to be grabbed only by the handle
			onStart(evt) {
				// Disable interaction with the first item by setting a custom class or element.
				// const firstItem = evt.from.children[0];
				// if (firstItem) {
				// 	firstItem.setAttribute('draggable', 'false');
				// }
			},
			onEnd(evt) {
				// // Re-enable draggable behavior for the first item if necessary
				// const firstItem = evt.from.children[0];
				// if (firstItem) {
				// 	firstItem.setAttribute('draggable', 'true');
				// }
			},
			onSort: handleSort
		});
	});
</script>

<sortable-list-container bind:this={foo}>
	{#each blocks as block, i}
		<div class="list-group-item sortable-item">
			{block.title}
		</div>
	{/each}
</sortable-list-container>

<style>
	sortable-list-container {
		display: block;
		width: 100%;
		overflow: auto;
		height: 100%;
	}

	.list-group-item {
		padding: 0 8px;
		margin: 4px;
		border: 1px solid white;
		transition: background-color 0.2s;
		min-height: 40px;
		display: flex;
		align-items: center;
		border-radius: 5px;
		font-weight: bold;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	/* Remove the hover effect and change cursor for the first item */
	.no-drag {
		cursor: not-allowed; /* Disable dragging cursor */
		background-color: transparent !important; /* Disable hover effect */
	}

	/* Only allow dragging on sortable items */
	.sortable-item:hover {
		cursor: grab;
		background-color: var(--color-theme-light-blue);
		box-shadow: 0 0px 8px 1px rgba(0, 131, 179, 0.75);
	}
</style>
