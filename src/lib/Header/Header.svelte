<script>
	import MainMenu from './MainMenu.svelte';
	import { user } from '$/stores';
	import { page } from '$app/stores';
</script>

<header>
	<p>{$user.name || ''}</p>
	<MainMenu />
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 8px);
		margin: 0 8px;
	}

	p {
		padding: 0;
		margin: 0;
	}
</style>
