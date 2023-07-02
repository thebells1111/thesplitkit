<script>	
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import {
		remoteServer,
		liveBlocks,
		defaultBlockGuid,
		mainSettings,
		activePageGuid
	} from '$/stores';

	const guid = $page.params.guid;
	$activePageGuid = guid;

	let badStartBlocks = [];
	let badValueBlocks = [];
	let remoteValues = [];
	let xmlText = '';

	onMount(loadBlocks);

	async function loadBlocks() {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
		const data = await res.json();
		$liveBlocks = data.blocks;

		console.log($liveBlocks);

		if ($liveBlocks?.length) {
			badStartBlocks = $liveBlocks.filter((v) => !v.startTime);
			badValueBlocks = $liveBlocks.filter((v) => !v?.value?.destinations?.length);
			console.log(!badStartBlocks?.length && !badValueBlocks?.length);

			if (!badStartBlocks?.length && !badValueBlocks?.length) {
				$liveBlocks.forEach((v) => {
					xmlText += '<podcast:valueTimeSplit';
					if (v.startTime) {
						xmlText += `\n   startTime="${v.startTime}"\n   remotePercentage="${
							v?.settings?.split || 100
						}"`;
					}
					if (v.duration) {
						xmlText += `\n   duration="${v.duration}"`;
					}

					xmlText += '\n>';
					xmlText += '\n';

					if (v.feedGuid) {
						xmlText += `  <podcast:remoteItem \n    feedGuid="${v.feedGuid}"`;
						if (v.itemGuid) {
							xmlText += `\n    itemGuid="${v.itemGuid}"`;
						}

						xmlText += '\n  />\n';
					} else {
						xmlText += '  <podcast:valueRecipient';

						v.value.destinations.forEach((w) => {
							// <podcast:valueRecipient name="Alice (Podcaster)" type="node" address="02d5c1bf8b940dc9cadca86d1b0a3c37fbe39cee4c7e839e33bef9174531d27f52" split="85" />
							xmlText += '\n    ';
							xmlText += `type="node"`;
							if (w.name) {
								xmlText += '\n    ';
								xmlText += `name="${w.name}"`;
							}
							xmlText += '\n    ';
							xmlText += `address="${w.address}"`;
							if (w.customKey) {
								xmlText += '\n    ';
								xmlText += `customKey="${w.customKey}"`;
							}
							if (w.customValue) {
								xmlText += '\n    ';
								xmlText += `customValue="${w.customValue}"`;
							}

							xmlText += '\n    ';
							xmlText += `split="${w.split || 100}"`;

							console.log(w);
						});

						xmlText += '\n  />\n';
					}

					xmlText += '</podcast:valueTimeSplit>';
					xmlText += '\n';
				});
			}
		}
	}

	// <podcast:valueTimeSplit startTime="60" duration="237" remotePercentage="95">
	//                <podcast:remoteItem itemGuid="https://podcastindex.org/podcast/4148683#1" feedGuid="a94f5cc9-8c58-55fc-91fe-a324087a655b" medium="music" />
	//             </podcast:valueTimeSplit>

	// <podcast:valueTimeSplit startTime="63" duration="388">
	//                 <podcast:valueRecipient name="Jimbob (Guest)" type="node" address="02dd306e68c46681aa21d88a436fb35355a8579dd30201581cefa17cb179fc4c15" split="10" />
	//             </podcast:valueTimeSplit>
</script>

<button
	on:click={() => {
		goto(`/events/dashboard/${guid}`);
	}}>Back</button
>

{#if badStartBlocks?.length || badValueBlocks?.length}
	<p>Go back and fix these blocks.</p>

	{#if badStartBlocks?.length}
		<p>These blocks need a start time.</p>
		<ul>
			{#each badStartBlocks as block}
				<li>{block.title}</li>
			{/each}
		</ul>
	{/if}

	{#if badValueBlocks?.length}
		<p>These blocks need a value block</p>
		<ul>
			{#each badValueBlocks as block}
				<li>{block.title}</li>
			{/each}
		</ul>
	{/if}
{:else}
	<textarea>{xmlText}</textarea>
{/if}

<style>
	textarea {
		display: block;
		flex: 1;
	}
</style>
