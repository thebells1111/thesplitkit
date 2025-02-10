<script>
	import SmallModal from '$lib/Modal/SmallModal.svelte';
	import Modal from '$lib/Modal/Modal.svelte';
	import AddFeed from './AddFeed.svelte';
	import AddMusic from './AddMusic/AddMusic.svelte';
	import AddPlaylist from './AddPlaylist/AddPlaylist.svelte';
	import MusicIcon from '$lib/icons/Music.svelte';
	import ChapterIcon from '$lib/icons/Chapter.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';
	import PlaylistIcon from '$lib/icons/Playlist.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import clone from 'just-clone';

	import { tick } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	import { copiedBlock, liveBlocks, blocksList, changeDefault } from '$/stores';

	export let addBlock = () => {};
	export let addFeed = () => {};
	export let handleChangeType = null;
	export let showSelectBlock;

	let showHelp = false;
	let helpMode = '';
	let showModal = false;

	let modalsConfig = {
		podcast: { show: false },
		chapter: { show: false },
		music: { show: false },
		playlist: { show: false }
		// add other modals here
	};

	function resetModals() {
		for (let key in modalsConfig) {
			modalsConfig[key].show = false;
		}
	}

	async function handleSelect(type) {
		resetModals();
		if (handleChangeType) {
			handleChangeType(type);
		}

		if (modalsConfig.hasOwnProperty(type)) {
			modalsConfig[type].show = true;

			if (['person', 'chapter'].find((v) => type === v)) {
				addBlock(type);
			}

			if (['podcast', 'music', 'playlist'].find((v) => type === v)) {
				showModal = true;
			}
		} else {
			if (['paste'].find((v) => v === type)) {
				await pasteBlock();
			}
		}
	}

	async function pasteBlock() {
		showSelectBlock = false;
		let blockGuid;
		do {
			blockGuid = generateBlockGuid();
		} while (!isBlockGuidUnique(blockGuid, $liveBlocks));

		let block = clone($copiedBlock);
		block.blockGuid = blockGuid;

		$liveBlocks = $liveBlocks.concat(block);
		console.log($copiedBlock);

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

		await tick();
		$blocksList.scrollTo({ top: $blocksList.scrollHeight, behavior: 'smooth' });
	}

	$: if ($changeDefault && $liveBlocks?.[0]?.feedGuid) {
		handleSelect('podcast');
	}
</script>

<div>
	<button on:click={handleSelect.bind(this, 'chapter')}>
		<icon>
			<ChapterIcon size="40" />
		</icon>
		Chapter
	</button>
	<button on:click={handleSelect.bind(this, 'music')}>
		<icon>
			<MusicIcon size="40" />
		</icon>
		Music
	</button>
	<button on:click={handleSelect.bind(this, 'podcast')}>
		<icon>
			<PodcastIcon size="40" />
		</icon>
		Podcast
	</button>
	<button on:click={handleSelect.bind(this, 'playlist')}>
		<icon>
			<PlaylistIcon size="40" />
		</icon>
		Playlist
	</button>

	{#if $copiedBlock && !handleChangeType}
		<button on:click={handleSelect.bind(this, 'paste')}>
			<icon>
				<CopyIcon size="40" />
			</icon>
			Paste
		</button>
	{/if}
</div>

{#if showModal}
	<Modal
		bind:showModal
		closeModal={() => {
			showSelectBlock = false;
			$changeDefault = false;
		}}
	>
		{#if modalsConfig.podcast.show}
			<AddFeed {addFeed} />
		{:else if modalsConfig.music.show}
			<AddMusic {addFeed} />
		{:else if modalsConfig.playlist.show}
			<AddPlaylist bind:showSelectBlock />
		{/if}
	</Modal>
{/if}

{#if showHelp}
	<SmallModal bind:showModal={showHelp} onClose={() => (helpMode = '')}>
		{#if !helpMode}
			<h2>Select a topic</h2>
			<button class="help-mode" on:click={() => (helpMode = 'chapter')}>What is a Chapter?</button>
			<button class="help-mode" on:click={() => (helpMode = 'music')}>What is Music?</button>
			<button class="help-mode" on:click={() => (helpMode = 'podcast')}>What is a Podcast?</button>
			<button class="help-mode" on:click={() => (helpMode = 'person')}>What is a Person?</button>
		{:else}
			<button
				class="help-back"
				on:click={() => {
					helpMode = '';
				}}>Back</button
			>
		{/if}
		{#if helpMode === 'chapter'}
			<h3>Chapter</h3>
			<p>
				A chapter is used to display an image or information to your audience. You can think of it
				as very similar to a chapter as found in any modern podcast app, but can be sent to the
				audience in real time. After the live episode is recorded, the chapter can be exported using
				the Enhance Your Podcast Tools for display in your regular podcast.
			</p>
			<p>
				To edit your chapter, click on on of the text to edit it, click the blue edit icon on the
				image to add a link to your image, click the purple info icon to add suplementary info.
				Click the link text to send a link to your audience, and click the edit boost button to add
				a value block to this chapter.
			</p>
			<p>
				You can preview what your audience will see with the preview icon in the upper left, and
				when you've finished all your edits, click the save icon.
			</p>
			<p>
				When exporting your chapter for inclusion in your podcasting chapters file, note that the
				Title is the text that will appear in your chapters. Also, a start time is required for the
				block if you want it to be included in your chapters file.
			</p>
			<p>
				A chapter may or may not have a value block. If it doesn't, then your default value block
				will be used.
			</p>
		{/if}
		{#if helpMode === 'music'}
			<h3>Music</h3>
			<p>
				If you're creating a music podcast, this is for you. This allows you to find the value 4
				value enabled artist to add to your podcast or live stream. It's not limited to music
				podcasts though. If you decide to play even one song in your podcast, you can use this block
				type to find the artist.
			</p>
			<p>
				The nice thing about this block type is the artists' info is already filled in for you,
				including the block duration, which is just the length of the song. If you're just playing a
				snippet of the song, you can edit the duration. And don't forget to add a start time for
				when you start playing the song in your podcast.
			</p>
			<p>
				You'll notice there's a blue add button next to each song, but also next to the album. This
				allows you to play an individual song and let your audience boost that song. You'll use the
				add song button more often than not. However, if you're doing a segment about a whole album,
				you can also click the add album button. Be careful though, not every band has a value block
				assigned to their album.
			</p>
		{/if}
		{#if helpMode === 'podcast'}
			<h3>Podcast</h3>
			<p>
				This allows you to search the entire Podcast Index for any podcast or podcast episode. This
				is primarily for adding your default block.
			</p>
			<p>
				When you're doing a live show, typically 95% of the split goes to the active block. But what
				about the other 5%? That will go to your default block. Usually, you're doing the live show
				as part of your podcast, so your podcast will be the default block.
			</p>
			<p>
				You can select your podcast, or an individual episode. Whichever you choose, the value block
				from the item will be imported. However, unlike a podcasting app, if your episode doesn't
				have a value block, this won't default to your podcast value block, so keep that in mind,
				and if you want to use an episode, make sure that episode has a value block.
			</p>
			<p>
				Although this is primarily for creating default blocks, it's not limited to that. If you are
				doing a segment about another podcast, or playing a clip, you can use this to include that
				podcast in the value flow. One thing to keep in mind is the duration will be the length of
				the podcast, which you probably won't want, so make sure you change that duration to the
				length of your segment or clip.
			</p>
		{/if}
		{#if helpMode === 'person'}
			<h3>Person</h3>
			<p>
				A person is just like a chapter. In fact, they're identical with one caveat. When you click
				the filter icon, and filter by person, the display changes to make selecting each person
				easier. The idea behind this is you may have a debate or conference forum with several
				people speaking. By creating a person block for each speaker, you can have a Split Kit
				operator clicking the image of each person as they are speaking, and the image on the
				listeners device updates with the info for the current speaker, and the ability to boost the
				current speaker
			</p>
			<p>
				Additionally, you may not have a podcast, but as a Split Kit operator for a live event, you
				may want yourself to be the default block. This way you're getting paid 5% for operating the
				Split Kit during the event. In this case, using Person and filling in your info and
				lightning address sets you up to receive your split.
			</p>
		{/if}
	</SmallModal>
{/if}

<style>
	h1 {
		margin: 0;
		color: var(--color-theme-purple);
	}
	h2 {
		color: var(--color-theme-blue);
	}
	div {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button {
		box-shadow: none;
		background-color: transparent;
		color: var(--color-text-0);
		display: flex;
		flex-direction: column;
	}

	icon {
		display: block;
		width: 50px;
		height: 50px;
		background-color: hsl(0, 0%, 96%);
		border-radius: 25px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.help {
		font-size: 2em;
		font-weight: 900;
	}

	.help-mode {
		font-size: 2em;
		text-decoration: underline;
	}

	.help-back {
		position: absolute;
		top: 8px;
		left: 0px;
	}
</style>
