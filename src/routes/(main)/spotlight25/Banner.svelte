<script>
	import clone from 'just-clone';

	import { liveBlocks } from '$/stores';
	export let block = {};
	export let showModal;
	export let activeBlock;
	export let imgSrc = '';
</script>

<div>
	<img
		src={imgSrc || block?.image || $liveBlocks[0].image}
		alt={block?.title}
		on:click={() => {
			showModal = true;
			activeBlock = clone(block);
		}}
	/>
</div>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 180px;
		cursor: pointer;
	}
	img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
