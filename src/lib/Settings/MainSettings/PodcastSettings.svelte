<script>
	import JSZip from 'jszip';
	import { ID3Writer } from 'browser-id3-writer';
	import { mainSettings, remoteServer, liveBlocks } from '$/stores';
	$: console.log($mainSettings);

	let enclosureUrl;
	let downloadInfo = '';

	$: enclosureUrl = $mainSettings?.liveEnclosure || '';
	$: liveStreamType = $mainSettings?.liveStreamType || 'audio';
	$: chatUrl = $mainSettings?.liveChatEnclosure || '';
	$: boostBoardUrl = $mainSettings?.boostBoard || '';
	$: liveBackgroundUrl = $mainSettings?.liveBackgroundUrl || '';

	function handleAutoSwitch(e) {
		$mainSettings.podcast = $mainSettings.podcast || {};
		$mainSettings.podcast.autoSwitch = e.target.checked;
	}

	function handleInput(e, setting) {
		$mainSettings[setting] = e.target.value;
	}

	async function setMP3Metadata(blob, metadata) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsArrayBuffer(blob);
			reader.onloadend = () => {
				const buffer = reader.result;
				const writer = new ID3Writer(buffer);
				writer
					.setFrame('TIT2', metadata.title)
					.setFrame('TPE1', [metadata.artist])
					.setFrame('TALB', metadata.album)
					.setFrame('COMM', metadata.comment)
					.setFrame('TXXX', metadata.internalId);
				writer.addTag();
				const taggedArrayBuffer = writer.arrayBuffer;
				const taggedBlob = new Blob([taggedArrayBuffer], {
					type: 'audio/mpeg'
				});
				resolve(taggedBlob);
			};
		});
	}

	async function downloadZippedMP3s(mp3Links) {
		const zip = new JSZip();
		let blocks = $liveBlocks.slice(1);

		if (blocks.length) {
			for (const [index, block] of blocks.entries()) {
				if (block?.duration < 10 * 60 && block.enclosureUrl) {
					console.log(block);
					console.log(`Downloading ${block.title}`);
					downloadInfo = `Downloading ${block.title}`;
					const res = await fetch(
						remoteServer + '/api/proxy?url=' + encodeURIComponent(block.enclosureUrl),
						{
							headers: { 'User-Agent': 'TheSplitKit/0.1' }
						}
					);
					let blob = await res.blob();

					const metadata = {
						title: block.title,
						artist: block?.line?.[1] || '',
						album: block?.line?.[0] || '',
						comment: {
							description: 'SplitKitMeta',
							text: `SplitKitMeta: {eventGuid:${block.eventGuid}, blockGuid:${block.blockGuid}, feedGuid:${block.feedGuid}, itemGuid:${block.itemGuid}}`
						},
						internalId: {
							description: 'mAirList',
							value: `<PlaylistItem Class="File"><Title>${block.title}</Title><Artist>${
								block?.line?.[1] || ''
							}</Artist><Comment>{eventGuid:${block.eventGuid}, blockGuid:${
								block.blockGuid
							}}</Comment><ExternalID>{eventGuid:${block.eventGuid}, blockGuid:${
								block.blockGuid
							}, feedGuid:${block.feedGuid}, itemGuid:${
								block.itemGuid
							}}</ExternalID></PlaylistItem>`
						}
					};

					blob = await setMP3Metadata(blob, metadata);
					let artist = sanitizeFilename(block?.line?.[1] || '');
					let album = sanitizeFilename(block?.line?.[1]);
					let song = sanitizeFilename(block.title);
					zip.file(
						(artist ? `${artist} - ` : '') +
							(album ? `${album} - ` : '') +
							(song ? `${song} - ` : '') +
							'.mp3',
						blob
					);
				}
			}

			function sanitizeFilename(filename) {
				return filename.replace(/[\\/:*?"<>|\x00-\x1F\x80-\x9F]/g, '');
			}

			const content = await zip.generateAsync({ type: 'blob' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(content);
			link.download = 'MP3Files.zip';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} else {
			// Handle 'No valid files to download'
		}
	}
</script>

<div>
	<div class="live-stream-type">
		<p>Link to Live Steam:</p>

		<label>
			<input
				type="radio"
				name="media"
				value="video"
				bind:group={liveStreamType}
				on:change={(e) => {
					handleInput(e, 'liveStreamType');
				}}
				checked={liveStreamType === 'video'}
			/>
			Video
		</label>
		<label>
			<input
				type="radio"
				name="media"
				value="audio"
				bind:group={liveStreamType}
				on:change={(e) => {
					handleInput(e, 'liveStreamType');
				}}
				checked={liveStreamType === 'audio'}
			/>
			Audio
		</label>
		<input
			type="url"
			value={enclosureUrl}
			on:input={(e) => {
				handleInput(e, 'liveEnclosure');
			}}
		/>
	</div>

	<label>
		<p>Link to Live Chatroom:</p>
		<input
			type="url"
			value={chatUrl}
			on:input={(e) => {
				handleInput(e, 'liveChatEnclosure');
			}}
		/>
	</label>

	<label>
		<p>Link to Boost Board:</p>
		<input
			type="url"
			value={boostBoardUrl}
			on:input={(e) => {
				handleInput(e, 'boostBoard');
			}}
		/>
	</label>

	<label>
		<p>Link to Live Background Image:</p>
		<input
			type="url"
			value={liveBackgroundUrl}
			on:input={(e) => {
				handleInput(e, 'liveBackgroundUrl');
			}}
		/>
	</label>

	<label class="checkbox">
		<input
			type="checkbox"
			on:input={handleAutoSwitch}
			checked={$mainSettings?.podcast?.autoSwitch}
		/>
		<p>Automatically Broadcast Default Podcast when Active Block ends.</p>
	</label>

	<warning>
		<p>
			When Auto Broadcast is enabled, any block without a duration will be unable to auto broadcast.
		</p>
	</warning>

	<button on:click={downloadZippedMP3s}>Download Zipped Audio Files</button>
	<warning>
		<p>
			Zipped Audio Files is experimental, and may be a paid feature in the future if server costs
			get out of hand. <br />
			It's for downloading songs, so will only download files with a duration of 10 minutes or less.
		</p>
	</warning>

	<download-info>
		{downloadInfo}
	</download-info>
</div>

<style>
	div {
		width: calc(100% - 12px);
		margin: 6px;
	}

	label {
		margin: 12px 0 4px 0;
		color: var(--color-theme-blue);
	}
	label p {
		margin: 0 0 2px 0;
		padding: 0;
		font-weight: bold;
	}

	label input {
		width: calc(100% - 18px);
		padding: 6px;
		margin-bottom: 6px;
	}

	label.checkbox {
		display: flex;
		width: 100%;
		align-items: flex-start;
		margin-top: 24px;
	}

	label.checkbox input {
		width: initial;
	}

	.live-stream-type {
		width: initial;
		margin: initial;
		margin-bottom: 8px;
	}

	.live-stream-type > p {
		margin: 0 0 2px 0;
		padding: 0;
		font-weight: bold;
		color: var(--color-theme-blue);
		display: inline;
	}

	.live-stream-type > label {
		margin: initial;
		color: initial;
	}

	.live-stream-type > label > input {
		width: initial;
		padding: 6px;
	}

	.live-stream-type > input {
		width: calc(100% - 18px);
		padding: 6px;
	}

	warning {
		color: red;
		text-align: left;
		font-weight: bold;
		font-size: 1.1em;
	}

	warning > p {
		margin: 0 8px 16px 8px;
	}

	download-info {
		display: block;
		color: var(--color-theme-purple);
		text-align: center;
		font-weight: bold;
		font-size: 1.3em;
	}

	button {
		margin-bottom: 4px;
	}
</style>
