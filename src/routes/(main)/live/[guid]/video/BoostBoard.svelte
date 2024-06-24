<script>
	import { mainSettings } from '$/stores';
</script>

<div class="iframe-container">
	<iframe src={$mainSettings?.boostBoard || ''} />
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
		height: 100%;
	}
</style>
