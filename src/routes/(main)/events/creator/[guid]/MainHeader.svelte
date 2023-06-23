<script>
	import clone from 'just-clone';
	import Save from '$lib/icons/Save.svelte';
	import Broadcast from '$lib/icons/Broadcast.svelte';

	import { remoteServer } from '$/stores';
	import { page } from '$app/stores';
	export let blocks;
	export let mainUnsaved = false;
	let initialized = false;
	let savedBlocks = [];

	$: compareBlocks(blocks);

	function compareBlocks() {
		if (JSON.stringify(blocks) !== JSON.stringify(savedBlocks)) {
			savedBlocks = clone(blocks);
			if (initialized) {
				mainUnsaved = true;
			} else {
				initialized = true;
			}
		}
	}

	function submitData() {
		console.log('submit');
		const newBlocks = blocks.map((block) => {
			const newBlock = clone(block);
			newBlock.line = newBlock.line
				.map((v) => {
					if (v !== 'Text - click to edit') {
						return v;
					} else {
						return '';
					}
				})
				.filter((v) => v);

			if (newBlock?.title === 'Title - click to edit') {
				newBlock.title = '';
			}
			if (newBlock?.link?.text === 'Link - click to edit') {
				newBlock.link.text = '';
			}
			if (!newBlock?.link?.text || !newBlock?.link?.url) {
				newBlock.link = { text: '', url: '' };
			}
			return newBlock;
		});

		saveEntry(newBlocks);
		mainUnsaved = false;
	}

	function saveEntry(blocks) {
		fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
			})
			.catch((error) => console.error(error));
	}
</script>

<header>
	<button class="save" class:unsaved={mainUnsaved} type="submit" on:click={submitData}>
		<Save size="32" />
	</button>
	<a href={'/events/broadcaster/' + $page.params.guid}><Broadcast size="32" /></a>
</header>

<style>
	header {
		width: 100%;
		max-width: 450px;
		display: flex;
		justify-content: space-between;
		margin: 8px auto;
	}

	button,
	a {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 25px;
		padding: 0;
		margin: 0 16px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	.unsaved {
		animation: heartbeat 1s infinite;
		z-index: 2;
	}

	@keyframes heartbeat {
		0% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
		50% {
			transform: scale(1.1);
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
		}
		100% {
			transform: scale(1);
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
		}
	}
</style>
