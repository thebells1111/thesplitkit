<script>
	import { onMount } from 'svelte';
	import { remoteServer } from '$/stores';

	let mp3Url =
		'https://ipfspodcasting.net/e/cdn.kolomona.com/podcasts/lightning-thrashes/002-Lightning-Thrashes.mp3';
	let chaptersUrl =
		'https://cdn.kolomona.com/podcasts/lightning-thrashes/002-Lightning-Thrashes.json';
	let chapters;
	let ffmpeg;

	onMount(() => {
		init();
	});

	async function loadChapters() {
		const res = await fetch(remoteServer + '/api/proxy?url=' + encodeURIComponent(chaptersUrl), {
			headers: { 'User-Agent': 'TheSplitKit/0.1' }
		});
		chapters = await res.json();
	}

	async function fetchFile(url) {
		const response = await fetch(url);
		const buffer = await response.arrayBuffer();
		return new Uint8Array(buffer);
	}

	async function init() {
		const { fetchFile } = FFmpegUtil;
		const { FFmpeg } = FFmpegWASM;
		console.log(FFmpeg);
		console.log('hi');
		ffmpeg = new FFmpeg();
		console.log(ffmpeg);
		await ffmpeg.load({
			coreURL: '/assets/core/package/dist/umd/ffmpeg-core.js'
		});
	}

	async function generateMp4() {
		await loadChapters();
		await ffmpeg.write(
			'audio.mp3',
			await fetchFile(remoteServer + '/api/proxy?url=' + encodeURIComponent(mp3Url))
		);

		for (let i = 0; i < chapters.length; i++) {
			const imgName = `image${i}.jpg`;
			await ffmpeg.write(imgName, await fetchFile(chapters[i].img));
		}

		await ffmpeg.run(
			'-framerate',
			'1',
			'-i',
			'image%d.jpg',
			'-i',
			'audio.mp3',
			'-c:v',
			'libx264',
			'-tune',
			'stillimage',
			'-c:a',
			'aac',
			'-strict',
			'experimental',
			'-b:a',
			'192k',
			'-pix_fmt',
			'yuv420p',
			'-vf',
			'scale=640:480',
			'out.mp4'
		);

		const data = ffmpeg.read('out.mp4');
		const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
		const url = URL.createObjectURL(videoBlob);

		const a = document.createElement('a');
		a.href = url;
		a.download = 'music-video.mp4';
		a.click();
	}
</script>

<svelte:head>
	<script src="/assets/ffmpeg/package/dist/umd/ffmpeg.js"></script>
	<script src="/assets/util/package/dist/umd/index.js"></script>
</svelte:head>

<input type="text" bind:value={mp3Url} placeholder="MP3 URL" />
<input type="text" bind:value={chaptersUrl} placeholder="Chapters JSON URL" />
<button on:click={generateMp4}>Generate MP4</button>
