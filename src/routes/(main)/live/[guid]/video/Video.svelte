<script>
	import Hls from 'hls.js';
	let player;
	let sourceVideo = 'https://content.jwplatform.com/manifests/yp34SRmf.m3u8';

	$: setSource(sourceVideo, player);

	function setSource(src, player) {
		console.log(player);
		if (player && src) {
			// src =
			// 	'https://noagendatube.com/static/streaming-playlists/hls/54ebb881-8581-4b16-b3ba-04dcac230fd4/master.m3u8';

			// src = 'https://content.jwplatform.com/manifests/yp34SRmf.m3u8';
			console.log(src);
			if (src.includes('.m3u8')) {
				if (player.canPlayType('application/vnd.apple.mpegurl')) {
					player.src = src;
					//
					// If no native HLS support, check if HLS.js is supported
					//
				} else if (Hls.isSupported()) {
					console.log('hello hls.js!');
					var hls = new Hls();
					// bind them together
					hls.attachMedia(player);
					// MEDIA_ATTACHED event is fired by hls object once MediaSource is ready
					hls.on(Hls.Events.MEDIA_ATTACHED, function () {
						console.log('video and hls.js are now bound together !');
						hls.loadSource(src);
						hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
							console.log('manifest loaded, found ' + data.levels.length + ' quality level');
							player.play();
						});
					});
				}
			} else {
				player.src = src;
				player.play();
			}
		}
	}
</script>

<div class="player">
	<video disableRemotePlayback playsinline preload="metadata" bind:this={player} />
</div>

<style>
	.player {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	video {
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
</style>
