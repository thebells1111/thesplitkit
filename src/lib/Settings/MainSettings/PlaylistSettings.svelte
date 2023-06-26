<script>
	import { mainSettings } from '$/stores';

	let jukeboxEnabled = false;
</script>

<label
	>Enable Juke Box Mode
	<input type="checkbox" bind:checked={jukeboxEnabled} />
</label>
