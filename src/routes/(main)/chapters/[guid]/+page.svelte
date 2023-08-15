<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { saveAs } from 'file-saver';
	import SaveModal from '$lib/Modal/SaveModal.svelte';

	import { remoteServer, liveBlocks, activePageGuid } from '$/stores';

	const guid = $page.params.guid;
	$activePageGuid = guid;

	let file = { version: '1.2' };
	let chapters = [];

	let badStartBlocks = [];
	let downloadStarted = false;

	onMount(loadBlocks);

	async function loadBlocks(reload) {
		chapters = [];
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
		}

		if ($liveBlocks?.length) {
			const chaps = $liveBlocks.filter((v) => !v?.settings?.default);
			let defaultBlock = $liveBlocks.filter((v) => v?.settings?.default);

			function createDefaultChapter(startTime) {
				let defaultChapter = defaultBlock.map((v) => {
					let chapter = { startTime: Math.round(startTime * 1000) / 1000 };

					if (v?.title) {
						chapter.title = v.title;
					}

					if (v?.image) {
						chapter.img = v.image;
					}
					if (v?.link?.url) {
						chapter.url = v.link.url;
					}

					return chapter;
				});
				return defaultChapter[0];
			}

			badStartBlocks = chaps.filter((v) => !v.startTime);

			if (!badStartBlocks?.length || reload) {
				chaps
					.sort((a, b) => a.startTime - b.startTime)
					.forEach((v, i, a) => {
						if (v.startTime) {
							let chapter = { startTime: v.startTime };

							if (v?.title && v?.title !== 'Title - click to edit') {
								chapter.title = v.title;
							} else if (v?.line[0] && v?.line[0] !== 'Text - click to edit') {
								chapter.title = v.line[0];
							} else if (v?.line[1] && v?.line[1] !== 'Text - click to edit') {
								chapter.title = v.line[1];
							} else {
								return;
							}

							if (v?.image) {
								chapter.img = v.image;
							}
							if (v?.link?.url) {
								chapter.url = v.link.url;
							}

							chapters.push(chapter);
						}
						if (v?.duration && defaultBlock?.length) {
							if (i < a.length - 1 && v?.startTime + v?.duration < a[i + 1]?.startTime) {
								chapters.push(createDefaultChapter(v.startTime + v.duration));
							}

							if (i === a.length - 1) {
								chapters.push(createDefaultChapter(v.startTime + v.duration));
							}
						}
					});
			}

			chapters = chapters.filter((v) => v);
			file.chapters = chapters;
		}

		console.log(file);
	}

	async function downloadFile(reload) {
		if (reload) {
			await loadBlocks(reload);
		}
		const blob = new Blob([JSON.stringify(file)], { type: 'text/plain;charset=utf-8' });
		saveAs(blob, `${guid}.json`);
		downloadStarted = true;
		setTimeout(() => {
			downloadStarted = false;
		}, 1000); // Message will disappear after 3 seconds
	}
</script>

<div>
	{#if badStartBlocks?.length}
		<h3>These blocks need a start time.</h3>
		{#if badStartBlocks?.length}
			<p>Go back and fix these blocks.</p>
			<ul>
				{#each badStartBlocks as block}
					<li>{block.title}</li>
				{/each}
			</ul>
		{/if}
		<p
			style="color:black; margin: 8px 0 0 0; font-weight: bold; font-size: 1.1em; text-align:center"
		>
			I understand. <br /> I want to download <br /> the good chapters anyway.
		</p>
		<button on:click={downloadFile}>Download Chapters File</button>
	{:else if chapters?.length}
		<button on:click={downloadFile}>Download Chapters File</button>
	{:else}
		<p>You have nothing in this block.</p>
	{/if}
</div>

{#if downloadStarted}
	<SaveModal>
		<p>Download Started</p>
	</SaveModal>
{/if}

<style>
	div {
		padding: 8px;
		display: flex;
		flex-direction: column;
	}

	button {
		margin: 32px auto;
		min-width: 200px;
	}

	h3 {
		margin: 16px 0 0 0;
		color: red;
	}
	p {
		margin: 4px;
		color: var(--color-theme-blue);
	}
</style>
