<script>
	import { v4 as uuidv4 } from 'uuid';
	import clone from 'just-clone';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import {
		remoteServer,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		activePageGuid
	} from '$/stores';

	const guid = $page.params.guid;

	let blocks;
	let chapters = [];

	onMount(loadBlocks);

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();
		console.log(data);
		blocks = data.blocks;

		if (blocks) {
			chapters = blocks.map((v) => {
				if (v.startTime) {
					return {
						title: v.title,
						img: v.image,
						startTime: v.startTime,
						url: v?.link?.url,
						endTime: v.duration ? v.startTime + v.duration : undefined
					};
				}
			});
		}

		console.log(chapters);
	}
</script>

{JSON.stringify(blocks)}
