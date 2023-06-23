<script>
	import { v4 as uuidv4 } from 'uuid';
	import { onMount } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MainHeader from './MainHeader.svelte';
	import AddBlocks from './AddBlocks.svelte';
	import { remoteServer, liveBlocks, defaultBlockGuid, mainSettings, activeGuid } from '$/stores';
	let mainUnsaved = false;

	export let guid = $page.params.guid;
	onMount(async () => {
		if (!$liveBlocks.length) {
			loadBlocks();
		}
	});

	$: if ($activeGuid !== guid) {
		$activeGuid = guid;
		loadBlocks();
	}

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();

		const blocks = data.blocks || [];
		$mainSettings = data.settings || $mainSettings;

		blocks.forEach((block) => {
			if (block.default) {
				$defaultBlockGuid = block.blockGuid;
			}
			if (!block.link.text) {
				block.link.text = 'Link - click to edit';
			}
			if (!block.title) {
				block.title = 'Title - click to edit';
			}
			for (let i = 1; i < block.line.length; i++) {
				if (!block.line[i]) {
					block.line[i] = 'Text - click to edit';
				}
			}
			if (!block.blockGuid) {
				let blockGuid;
				do {
					blockGuid = generateBlockGuid();
				} while (!isBlockGuidUnique(blockGuid, blocks));

				block.blockGuid = blockGuid;
			}
		});

		if (!$defaultBlockGuid) {
			$defaultBlockGuid = blocks?.[0]?.blockGuid;
		}
		$liveBlocks = blocks;
		console.log($liveBlocks);
	}

	function generateBlockGuid() {
		let uniqueId = uuidv4();
		return uniqueId;
	}

	function isBlockGuidUnique(blockGuid, blocks) {
		for (let block of blocks) {
			if (block.blockGuid === blockGuid) {
				return false;
			}
		}
		return true;
	}

	beforeNavigate(({ to, cancel }) => {
		if (mainUnsaved) {
			if (to) {
				let stay = confirm('Leave site?\nChanges you made may not be saved');
				if (!stay) {
					cancel();
				}
			} else {
				cancel();
			}
		}
	});
</script>

<MainHeader blocks={$liveBlocks} bind:mainUnsaved />
<add-blocks>
	<AddBlocks bind:blocks={$liveBlocks} />
</add-blocks>

<style>
	add-blocks {
		display: block;
		flex: 1;
		height: calc(100% - 50px);
	}
</style>
