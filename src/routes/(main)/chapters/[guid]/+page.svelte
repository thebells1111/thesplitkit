<script>
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { saveAs } from 'file-saver';
	import SaveModal from '$lib/Modal/SaveModal.svelte';

	import AddFeed from '$lib/Creator/AddFeed.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	import {
		remoteServer,
		liveBlocks,
		activePageGuid,
		defaultBlockGuid,
		mainSettings,
		changeDefault
	} from '$/stores';

	const guid = $page.params.guid;
	$activePageGuid = guid;

	let file = { version: '1.2' };
	let chapters = [];

	let badStartBlocks = [];
	let downloadStarted = false;
	let defaultChapterTitle = '';
	let defaultChapterImage = '';

	onMount(loadBlocks);

	async function loadBlocks(reload) {
		chapters = [];
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
		}

		if ($liveBlocks?.length) {
			const chaps = $liveBlocks.slice(1);
			let defaultBlock = [$liveBlocks[0]];

			function createDefaultChapter(startTime) {
				let defaultChapter = defaultBlock.map((v) => {
					let chapter = { startTime: Math.round(startTime * 1000) / 1000 };

					if (v?.title && v?.title !== 'Title - click to edit') {
						chapter.title = v.title;
					} else if (
						v?.line[0] &&
						v?.line[0] !== 'Text - click to edit' &&
						v?.line[0] !== 'Title - click to edit'
					) {
						chapter.title = v.line[0];
					} else if (
						v?.line[1] &&
						v?.line[1] !== 'Text - click to edit' &&
						v?.line[1] !== 'Title - click to edit'
					) {
						chapter.title = v.line[1];
					} else {
						chapter.title = '';
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

			badStartBlocks = chaps.filter((v) => v && !v.startTime);

			if (!badStartBlocks?.length || reload) {
				chaps
					.sort((a, b) => a.startTime - b.startTime)
					.forEach((v, i, a) => {
						if (v.startTime) {
							let chapter = { startTime: v.startTime };

							if (v?.title && v?.title !== 'Title - click to edit') {
								chapter.title = v.title;
							} else if (
								v?.line[0] &&
								v?.line[0] !== 'Text - click to edit' &&
								v?.line[0] !== 'Title - click to edit'
							) {
								chapter.title = v.line[0];
							} else if (
								v?.line[1] &&
								v?.line[1] !== 'Text - click to edit' &&
								v?.line[1] !== 'Title - click to edit'
							) {
								chapter.title = v.line[1];
							} else {
								chapter.title = '';
							}

							if (v?.image) {
								chapter.img = v.image;
							}
							if (v?.link?.url) {
								chapter.url = v.link.url;
							}

							chapters.push(chapter);
						}
						if (v?.duration) {
							if (i < a.length - 1 && v?.startTime + v?.duration < a[i + 1]?.startTime) {
								if ($liveBlocks[0]) {
									chapters.push(createDefaultChapter(v.startTime + v.duration));
								}
							}

							if (i === a.length - 1) {
								if ($liveBlocks[0]) {
									chapters.push(createDefaultChapter(v.startTime + v.duration));
								}
							}
						}
					});
			}
			if ($liveBlocks[0]) {
				chapters.unshift(createDefaultChapter(0.001));
			}

			console.log(chapters);

			chapters = chapters.filter((v) => v);
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

	async function addDefaultChapter() {
		let newBlock = {};
		newBlock.title = defaultChapterTitle;
		newBlock.image = defaultChapterImage;
		newBlock.line = [];
		newBlock.description = '';
		newBlock.value = {
			model: {
				type: 'lightning',
				method: 'keysend'
			},
			destinations: []
		};
		newBlock.type = 'chapters';
		newBlock.link = {
			text: '',
			url: ''
		};
		newBlock.chaptersUrl = '';

		newBlock.eventGuid = $page.params.guid;
		newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';
		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

		newBlock.blockGuid = blockGuid;
		newBlock.settings = {
			split: $mainSettings.splits
		};

		$defaultBlockGuid = blockGuid;
		newBlock.settings.default = true;
		$liveBlocks[0] = newBlock;
	}

	async function addFeed(block, type, channel) {
		let addBlock = true;

		block.value = block?.value || channel?.value;

		if (addBlock) {
			let newBlock = {};
			newBlock.image = block?.artwork || block?.image || channel?.artwork || channel?.image;
			if (channel) {
				newBlock.title = block?.title;
				newBlock.line = [channel?.title, channel?.author];
			} else {
				newBlock.title = block?.title;
				newBlock.line = [channel?.author];
			}

			newBlock.description = block.description;
			newBlock.value = block?.value ||
				channel?.value || {
					model: {
						type: 'lightning',
						method: 'keysend'
					},
					destinations: []
				};
			newBlock.type = type;

			newBlock.link = {
				text: 'Checkout the Album',
				url: block?.link || channel?.link || `https://podcastindex.org/podcast/${channel.id}`
			};
			newBlock.chaptersUrl = block?.chaptersUrl;

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
			}

			newBlock.feedGuid = channel?.podcastGuid || block?.podcastGuid;

			newBlock.itemGuid = block.guid;

			newBlock.eventGuid = $page.params.guid;
			newBlock.eventAPI = 'https://curiohoster.com/api/sk/event/lookup';

			if (block.enclosureUrl) {
				newBlock.enclosureUrl = block.enclosureUrl;
				newBlock.duration = await getMediaDuration(block.enclosureUrl);
			}

			let blockGuid;
			do {
				blockGuid = generateBlockGuid();
			} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

			newBlock.blockGuid = blockGuid;
			newBlock.settings = {
				split: $mainSettings.splits
			};

			$defaultBlockGuid = blockGuid;
			newBlock.settings.default = true;
			$liveBlocks[0] = newBlock;
		}
	}

	function generateBlockGuid() {
		let uniqueId = uuidv4();
		return uniqueId;
	}

	function isBlockGuidUnique(blockGuid, blocks) {
		for (let block of blocks) {
			if (block?.blockGuid === blockGuid) {
				return false;
			}
		}
		return true;
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

	{#if !$liveBlocks[0]}
		<default-block-container>
			<h3>Wait! Wait! Wait!</h3>
			<p>You can add a fallback chapter image to show between blocks.</p>
			<p>
				This is great if you're doing a music show with segments were the DJ is talking but no song
				is playing.
			</p>
			<chapter-container>
				<chapter-info>
					<label>
						Chapter Title
						<input bind:value={defaultChapterTitle} />
					</label>
					<label>
						Chapter Image Link:
						<input bind:value={defaultChapterImage} />
					</label>
				</chapter-info>
				<img
					width="92"
					height="92"
					src={defaultChapterImage}
					alt="chapter art"
					style="border: 1px solid black"
				/>
			</chapter-container>
			<button class="create-chapter" on:click={addDefaultChapter}>Create Fallback Chapter</button>
			<p>-or-</p>
			<p>Use your podcast info</p>
			<add-feed-container>
				<AddFeed {addFeed} />
			</add-feed-container>
		</default-block-container>
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
		overflow: hidden;
		height: 100%;
	}

	default-block-container {
		display: block;
		flex: 1;
		overflow: hidden;
	}

	add-feed-container {
		display: block;
		overflow: auto;
		height: calc(100% - 100px);
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

	chapter-container {
		display: flex;
		justify-content: space-between;
	}

	chapter-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
	}

	chapter-info label {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		font-weight: 600;
		margin: 8px;
	}

	img {
		margin: 8px 0 0 0;
	}

	default-block-container > h3 {
		text-align: center;
	}

	default-block-container > p {
		text-align: center;
	}

	button.create-chapter {
		margin: 4px auto;
		width: 100%;
		background-color: var(--color-theme-yellow);
		color: var(--color-text-0);
	}
</style>
