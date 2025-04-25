<script>
	import Hls from 'hls.js';
	import io from 'socket.io-client';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { mainSettings, remoteServer, liveMode, liveEnclosure } from '$/stores';

	let player;
	let block;
	$: sourceVideo = $mainSettings?.liveEnclosure || '';
	// sourceVideo = 'https://listen.noagendastream.com/noagenda';

	$: setSource(sourceVideo, player);

	function setSource(src, player) {
		console.log(player);
		console.log(src);
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

	onMount(async () => {
		const url = remoteServer + '/event?event_id=' + $page.params.guid;
		const liveItemSocket = io.connect(url);

		liveItemSocket.on('remoteValue', function (data) {
			block = data;
		});
		liveItemSocket.on('playerPause', function (data) {
			// You will need to adjust this part based on the actual format of the data sent by the server
			console.log(data);
		});
	});

	$: showLiveChapters = $mainSettings?.liveStreamType === 'audio' || !$mainSettings?.liveStreamType;
</script>

<container>
	{#if showLiveChapters}
		<img
			class="image"
			src={block?.image || block?.artwork || ''}
			alt="live artwork"
			width="300"
			height="300"
		/>
	{/if}
	<div class="player">
		<video
			class:audio={showLiveChapters}
			disableRemotePlayback
			playsinline
			controls
			preload="metadata"
			bind:this={player}
		/>
	</div>
</container>

<style>
	container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		overflow: hidden;
	}
	.player {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		overflow: hidden;
	}

	video {
		max-width: 100%;
		max-height: 100%;
		width: auto;
		height: auto;
		object-fit: contain;
	}
	.audio {
		height: 50px;
		width: 100%;
		max-width: 450px;
	}

	.image {
		width: 100%;
		max-width: 450px;
		height: auto;
	}
</style>
