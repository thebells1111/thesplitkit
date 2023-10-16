<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	import { remoteServer, liveBlocks, activePageGuid } from '$/stores';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import LinkIcon from '$lib/icons/Link.svelte';

	const guid = $page.params.guid;
	$activePageGuid = guid;

	let badStartBlocks = [];
	let badValueBlocks = [];
	let remoteValues = [];
	let xmlText = '';
	let userDanger = true;
	export let showDownloadFeed;
	export let isFeedDownload;

	onMount(loadBlocks);

	async function loadBlocks() {
		if (!$liveBlocks?.length) {
			const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + guid);
			const data = await res.json();
			$liveBlocks = data.blocks;
		}

		if ($liveBlocks?.length) {
			const blocks = $liveBlocks.slice(1);
			badStartBlocks = blocks.filter((v) => v && !v.startTime);
			badValueBlocks = blocks.filter((v) => v && !v?.value?.destinations?.length);

			if ((!badStartBlocks?.length && !badValueBlocks?.length) || !userDanger) {
				blocks.forEach((v) => {
					if (v) {
						if (v.startTime && v.duration && v?.value?.destinations?.length) {
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
						}
					}
				});
			}
		}

		if (!(badStartBlocks?.length || badValueBlocks?.length)) {
			showDownloadFeed = true;
		}
	}

	function copyText() {
		navigator.clipboard.writeText(xmlText);
		alert('Copied to clipboard');
	}

	let instructionText = `
     
        
    />
`;
</script>

{#if (badStartBlocks?.length || badValueBlocks?.length) && userDanger}
	<warning-container>
		<h3>Go back and fix these blocks.</h3>
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
		<button
			on:click={() => {
				if (isFeedDownload) {
					showDownloadFeed = true;
				} else {
					userDanger = false;
					loadBlocks();
				}
			}}
		>
			I understand.<br />{isFeedDownload
				? "I don't want those blocks in my feed"
				: 'Show me the good splits.'}
		</button>
	</warning-container>
{:else}
	<instruction-block>
		<h4>
			In your feed, paste the Value Time Splits in the {`<podcast:value>`} tag of your episode.
		</h4>

		<h4>Below is an example:</h4>
		<p class="instructions">
			{`<podcast:value type="lightning" method="keysend" suggested="0.00000005000" >`}
		</p>
		<p class="instructions indent-1">
			{`<podcast:valueRecipient`}
		</p>
		<p class="instructions indent-2">
			{`name="Podcastindex.org"`}
		</p>
		<p class="instructions indent-2">
			{`type="node"`}
		</p>
		<p class="instructions indent-2">
			{`address="03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a"`}
		</p>
		<p class="instructions indent-2">
			{`split="100"`}
		</p>
		<p class="instructions indent-1">
			{`/>`}
		</p>
		<p class="instructions indent-1 paste">Paste your value time splits here.</p>
		<p class="instructions">
			{`</podcast:value>`}
		</p>
	</instruction-block>
	<h3>Here's your<br /> Value Time Splits<br /> to paste.</h3>
	<textarea>{xmlText}</textarea>
	<button class="dl-link" on:click={copyText}>
		<copy-link-icon class="multi-icon">
			<CopyIcon size="32" />
		</copy-link-icon>
	</button>
{/if}

<style>
	instruction-block {
		align-self: flex-start;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin: 8px;
		overflow: hidden;
	}
	textarea {
		display: block;
		flex: 1;
		width: calc(100% - 42px);
		border-radius: 8px;
		padding: 8px;
		margin: 8px 16px 16px 16px;
		resize: none;
	}

	button.dl-link {
		width: 200px;
		font-weight: 700;
		border-radius: 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid transparent;
		height: 32px;
		color: white;
		box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.5);
		position: absolute;
		bottom: 24px;
		right: 20px;
		background-color: var(--color-theme-blue);
		width: 50px;
		height: 50px;
		border-radius: 50px;
		margin: 0;
	}

	.instructions {
		padding: 0;
		margin: 0;
		align-self: flex-start;
		font-size: 0.9em;
	}

	.indent-1 {
		padding-left: 16px;
	}
	.indent-2 {
		padding-left: 32px;
	}

	.paste {
		color: red;
		font-weight: bold;
	}

	h3 {
		margin: 0;
		text-align: center;
	}

	h4 {
		margin: 0;
		text-align: center;
		width: calc(100% - 8px);
		margin: 4px 16px 8px 0px;
	}

	warning-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	warning-container h3 {
		margin: 0;
		width: 100%;
		color: red;
	}

	warning-container p {
		color: var(--color-theme-blue);
		margin: 4px;
	}
</style>
