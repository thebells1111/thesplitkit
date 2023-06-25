<script>
	import { mainSettings } from '$/stores';

	let jukeboxEnabled = $mainSettings.jukeboxEnabled || false;
	$: $mainSettings.jukeboxEnabled = jukeboxEnabled;
</script>

<label
	>Enable Juke Box Mode
	<input type="checkbox" bind:checked={jukeboxEnabled} />
</label>
