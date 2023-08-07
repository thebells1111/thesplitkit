<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { saveAs } from 'file-saver';
	import SaveModal from '$lib/Modal/SaveModal.svelte';

	import { remoteServer, liveBlocks, activePageGuid } from '$/stores';

	const guid = $page.params.guid;
	$activePageGuid = guid;

	let file = { version: 1.2 };
	let chapters = [];

	let badStartBlocks = [];
	let downloadStarted = false;

	onMount(loadBlocks);

	async function loadBlocks(reload) {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
		}

		if ($liveBlocks?.length) {
			const chaps = $liveBlocks.filter((v) => !v?.settings?.default);
			badStartBlocks = chaps.filter((v) => !v.startTime);

			if (!badStartBlocks?.length || reload) {
				chapters = chaps
					.map((v) => {
						if (v.startTime) {
							console.log(v);
							let chapter = { startTime: v.startTime };

							if (v?.title) {
								chapter.title = v.title;
							}
							if (v?.duration) {
								chapter.endTime = v.startTime + v.duration;
							}
							if (v?.image) {
								chapter.img = v.image;
							}
							if (v?.link?.url) {
								chapter.url = v.link.url;
							}

							return chapter;
						}
					})
					.filter((v) => v)
					.sort((a, b) => a.startTime - b.startTime);
			}
			console.log(chapters);
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
