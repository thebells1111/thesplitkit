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
	let remoteValues = [];

	onMount(loadBlocks);

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();
		blocks = data.blocks;

		console.log(blocks);

		if (blocks?.length) {
			remoteValues = blocks
				.map((v) => {
					let value = {};
					console.log(v);
					if (v.startTime) {
						value = {
							'@_startTime': v.startTime,
							'@_remotePercentage': v?.settings?.split || 100
						};

						if (v.duration) {
							value['@_duration'] = v.duration;
						}
						console.log(value);
					}
					return value;
				})
				.filter((v) => v['@_startTime']);
		}

		console.log(remoteValues);
	}

	// <podcast:valueTimeSplit startTime="60" duration="237" remotePercentage="95">
	//                <podcast:remoteItem itemGuid="https://podcastindex.org/podcast/4148683#1" feedGuid="a94f5cc9-8c58-55fc-91fe-a324087a655b" medium="music" />
	//             </podcast:valueTimeSplit>

	// <podcast:valueTimeSplit startTime="63" duration="388">
	//                <podcast:valueRecipient name="Alice (Podcaster)" type="node" address="02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52" split="85" />
	//                <podcast:valueRecipient name="Jimbob (Guest)" type="node" address="02dd306e68c46681aa21d88a436fb35355a8579dd30201581cefa17cb179fc4c15" split="10" />
	//             </podcast:valueTimeSplit>
</script>

{JSON.stringify(blocks)}
