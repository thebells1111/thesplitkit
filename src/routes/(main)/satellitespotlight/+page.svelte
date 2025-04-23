<script>
	import { onMount } from 'svelte';
	import Desktop from './Desktop/Desktop.svelte';
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

	export let guid = '1e34e11b-f536-4280-b068-7dd1a9399b12';
</script>

{#if isMobile}
	<Mobile {guid} />
{:else}
	<Desktop {guid} />
{/if}
