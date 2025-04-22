<script>
	import { onMount } from 'svelte';
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile/Mobile.svelte';

	let isMobile = false;

	const checkScreenWidth = () => {
		isMobile = window.innerWidth < 720;
	};

	onMount(() => {
		checkScreenWidth();
		window.addEventListener('resize', checkScreenWidth);
		return () => window.removeEventListener('resize', checkScreenWidth);
	});

	export let guid;
</script>

{#if isMobile}
	<Mobile {guid} />
{:else}
	<Desktop {guid} />
{/if}
