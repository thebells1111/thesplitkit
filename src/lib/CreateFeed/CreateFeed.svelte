<script>
	import AddingPrompt from './AddingPrompt.svelte';
	import Channel from './Channel.svelte';
	import ItemEditor from './Item.svelte';
	import ItemValue from './ItemValue.svelte';
	let screenIndex = 0;
	let feed = { image: {}, description: '', item: [], value: { destinations: [] } };
	let item = {
		title: '',
		image: { url: '' },
		description: '',
		enclosureUrl: '',
		value: { destinations: [] },
		chaptersUrl: '',
		transcriptsUrl: ''
	};

	let screens = [AddingPrompt, Channel, ItemEditor, ItemValue];
	console.log(item);
</script>

<svelte:component this={screens[screenIndex]} bind:screenIndex bind:feed bind:item />
