<script>
	import { mainSettings } from '$/stores';
</script>

<div class="iframe-container">
	<iframe width="600" src={$mainSettings?.boostBoard || ''} />
</div>

<style>
	.iframe-container {
		width: 100%; /* Mobile width */
		height: 100%; /* Mobile height */
		overflow: hidden;
		position: relative;
	}

	.iframe-container iframe {
		border: none;
		transform: scale(0.5);
		transform-origin: 0 0;
		height: 200%;
	}
</style>
