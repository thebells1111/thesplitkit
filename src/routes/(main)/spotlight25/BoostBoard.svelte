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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.iframe-container iframe {
		border: none;
		height: 100%;
		width: 100%;
	}
</style>
