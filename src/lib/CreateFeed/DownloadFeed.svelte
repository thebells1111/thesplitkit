<script>
	import { v4 as uuidv4 } from 'uuid';
	import { XMLParser, XMLBuilder } from 'fast-xml-parser';
	import { onMount } from 'svelte';
	import { liveBlocks } from '$/stores';

	export let feed;
	export let item;
	export let screenIndex;
	import clone from 'just-clone';

	let warningMessage = ''; // Initialize as empty string
	let rssErrors = [];
	let xmlFile;

	onMount(verifyFeed);

	let buildOptions = {
		attributeNamePrefix: '@_',
		textNodeName: '#text',
		ignoreAttributes: false,
		format: true,
		indentBy: '  ',
		processEntities: false,
		supressEmptyNode: true,
		allowBooleanAttributes: true,
		suppressBooleanAttributes: false,
		attributeValueProcessor: (name, val, jPath) => escapeAttr(name, val, jPath),
		tagValueProcessor: (name, val, jPath) => escapeTag(name, val, jPath)
	};

	const escapeAttr = (name, val, jPath) => {
		return `${val}`.replace(
			/[&<>'"]/g,
			(tag) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					"'": '&#39;',
					'"': '&quot;'
				}[tag])
		);
	};

	const escapeTag = (name, val, jPath) => {
		let str = `${val}`;
		if (str.match(/[&<>'"]/g)) {
			return '<![CDATA[' + str + ']]>';
		}
		return str;
	};

	function isValidURL(str) {
		try {
			new URL(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	async function verifyFeed() {
		rssErrors = [];
		if (!feed.title) {
			rssErrors.push('Your podcast needs a title.');
		}
		if (!feed?.image?.url) {
			rssErrors.push('Your podcast needs an image.');
		}
		if (!feed?.link) {
			rssErrors.push('Your podcast needs a website link.');
		}
		if (!feed?.description) {
			rssErrors.push('Your podcast needs a description.');
		}
		if (!feed?.['itunes:explicit']) {
			rssErrors.push('Click Yes or No on Podcast Explicit Content');
		}

		rssErrors.push(checkValue(feed, 'podcast'));
		if (!item.title) {
			rssErrors.push('Your episode needs a title.');
		}
		if (!item?.enclosure?.['@_url']) {
			rssErrors.push('Your episode needs an audio file.');
		}
		if (!item?.duration) {
			rssErrors.push('Click Get Audio Duration for your Episode.');
		}
		rssErrors.push(checkValue(item, 'episode'));
		rssErrors = rssErrors.filter((v) => v);
		createVTS();
	}

	async function verifyFile(type) {
		let url = item[`podcast:${type}`]['@_url'];
		warningMessage = '';

		if (!isValidURL(url)) {
			warningMessage = 'Invalid URL';
			return;
		}

		try {
			const response = await fetch(`/api/proxy?q=${encodeURIComponent(url)}`);
			if (!response.ok) {
				warningMessage = 'No File is returned from that URL';
				return;
			}

			const contentType = await response.text();

			if (type === 'chapters' && contentType !== 'application/json') {
				warningMessage = "Improper Chapter File Type. Ensure it's a JSON file.";
			} else if (
				type === 'transcript' &&
				!['application/x-subrip', 'application/srt'].includes(contentType)
			) {
				warningMessage = "Improper Transcript File Type. Ensure it's an SRT file.";
			}
		} catch (error) {
			warningMessage = 'An error occurred while verifying the file.';
		}
	}

	async function createFeed() {
		let rss = {
			'@_version': '2.0',
			'@_xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
			'@_xmlns:podcast':
				'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md'
		};

		feed['podcast:guid'] = feed['podcast:guid'] || uuidv4();

		let _item = clone(item);

		_item.pubDate = new Date().toUTCString().split(' GMT')[0] + ' +0000';

		_item['itunes:author'] = feed['itunes:author'];
		_item.guid['#text'] = uuidv4();

		if (!_item['itunes:author']) {
			delete _item['itunes:author'];
		}
		if (!_item?.description) {
			delete _item.description;
		}
		if (!_item?.['itunes:image']?.['@_href']) {
			delete _item['itunes:image'];
		}
		if (!_item?.['podcast:chapters']?.['@_url']) {
			delete _item['podcast:chapters'];
		}
		if (!_item?.['podcast:transcript']?.['@_url']) {
			delete _item['podcast:transcript'];
		}
		feed.item = [_item, ...feed.item];

		rss.channel = feed;

		let xmlJson = { rss: rss };

		const builder = new XMLBuilder(buildOptions);
		xmlFile = builder.build(xmlJson);
		console.log(xmlFile);
		console.log(xmlJson.rss.channel);
	}

	function checkValue(obj, type) {
		let warning = '';
		let totalSplit = 0;

		obj['podcast:value'] = obj?.['podcast:value'] || {
			'podcast:valueRecipient': [
				{
					'@_name': '',
					'@_address': '',
					'@_type': 'node',
					'@_customKey': '',
					'@_customValue': '',
					'@_split': ''
				}
			],
			'@_type': 'lightning',
			'@_method': 'keysend',
			'@_suggested': '0.00000005000'
		};
		let value = obj['podcast:value'];

		value['podcast:valueRecipient'] = [].concat(value['podcast:valueRecipient']).filter((v) => v);

		if (value?.['podcast:valueRecipient']?.length === 0) {
			warning += `Provide a value recipient for your ${type}.\n`;
		} else if (
			value?.['podcast:valueRecipient']?.length === 1 &&
			!value['podcast:valueRecipient']['@_name'] &&
			!value['podcast:valueRecipient']['@_address']
		) {
			obj['podcast:value'] = clone(feed['podcast:value']);
			value = obj['podcast:value'];
		} else {
			value['podcast:valueRecipient'].forEach((recipient, i) => {
				if (!recipient['@_name']) {
					warning += `Recipient ${i} in ${type} doesn't have a name.\n`;
				}
				if (!recipient['@_address']) {
					let recipientName = recipient['@_name'] || `Recipient ${i}`;
					warning += `${recipientName} in ${type} doesn't have an address.\n`;
				}
				if (!recipient['@_split']) {
					let recipientName = recipient['@_name'] || `Recipient ${i}`;
					warning += `${recipientName} in ${type} doesn't have a split.\n`;
				} else {
					recipient['@_split'] = Number(recipient['@_split']);
					totalSplit += recipient['@_fee'] ? 0 : recipient['@_split'];
				}
			});

			if (totalSplit !== 100) {
				warning += type.charAt(0).toUpperCase() + type.slice(1) + " splits don't add up to 100%.\n";
			}
		}

		return warning;
	}

	async function downloadFeed() {
		console.log(feed);
		console.log(item);
		verifyFeed();
	}

	function createVTS() {
		let xmlText = '';
		let vts = [];
		if ($liveBlocks?.length) {
			const blocks = $liveBlocks.slice(1);

			vts = blocks.map((v) => {
				let n = { 'podcast:remoteItem': {} };
				if (v) {
					if (v.startTime && v.duration && v?.value?.destinations?.length) {
						if (v.startTime) {
							n['@_startTime'] = Number(v.startTime);
							n['@_remotePercentage'] = Number(v?.settings?.split || 100);
						}
						if (v.duration) {
							n['@_duration'] = v.duration;
						}

						if (v.feedGuid) {
							n['podcast:remoteItem']['@_feedGuid'] = v.feedGuid;
						}
						if (v.itemGuid) {
							n['podcast:remoteItem']['@_itemGuid'] = v.itemGuid;
						}

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
				return n;
			});
		}

		console.log(vts);
	}
</script>

<container>
	{#if rssErrors.length}
		<h2>Go back and fix these issues.</h2>
		<ul>
			{#each rssErrors as errorMsg}
				<li>{errorMsg}</li>
			{/each}
		</ul>
	{:else}
		<button on:click={downloadFeed}>Download Feed</button>
	{/if}
</container>
<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Chapters/Transcript</button
	>
</button-container>

<style>
	container {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
		overflow: auto;
		align-items: center;
	}

	h2 {
		margin: 0;
		color: var(--color-theme-2);
		text-align: center;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 8px 8px 16px 8px;
		display: flex;
		justify-content: space-between;
	}
</style>
