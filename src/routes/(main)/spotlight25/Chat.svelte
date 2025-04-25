<script>
	import { mainSettings } from '$/stores';
</script>

<div>
	<!-- <img src="/chat-top3.png" /> -->
	<iframe src={$mainSettings?.liveChatEnclosure || ''} />
	<!-- <img class="bottom" src="/chat-bottom.png" /> -->
</div>

<style>
	div {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	img {
		width: 100%;
	}
	iframe {
		width: calc(100% - 6px);
		border: none;
		/* border-left: 4px solid rgb(39, 41, 48);
		border-right: 3px solid rgb(39, 41, 48); */
		flex-grow: 1;
		/* border-radius: 0 0 8px 8px; */
	}

	.bottom {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
</style>
