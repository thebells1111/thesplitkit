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

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
		}

		if ($liveBlocks?.length) {
			const chaps = $liveBlocks.filter((v) => !v?.settings?.default);
			badStartBlocks = chaps.filter((v) => !v.startTime);

			if (!badStartBlocks?.length) {
				chapters = chaps.map((v) => {
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
				});
			}
			file.chapters = chapters;
		}

		console.log(file);
	}

	function downloadFile() {
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
		width: 200px;
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
