<script>
	import { v4 as uuidv4 } from 'uuid';
	import parser from 'fast-xml-parser';

	export let feed;
	export let item;
	export let screenIndex;
	import clone from 'just-clone';

	let warningMessage = ''; // Initialize as empty string
	let rssErrors = [];
	let showErrorModal = false;
	let showPublishModal = false;
	let showXMLModal = false;
	let xmlFile;

	let js2xml = new parser.j2xParser({
		attributeNamePrefix: '@_',
		//attrNodeName: false,
		textNodeName: '#text',
		ignoreAttributes: false,
		ignoreNameSpace: false,
		format: true,
		indentBy: '  ',
		supressEmptyNode: true,
		attrValueProcessor: (val, attrName) => escapeAttr(`${val}`),
		tagValueProcessor: (val, tagName) => escapeTag(`${val}`)
	});

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

		if (rssErrors.length) {
			showErrorModal = true;
			console.log(rssErrors);
		} else {
			createFeed();
		}
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

		_item.pubDate =
			new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000';

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

		xmlFile = js2xml.parse(xmlJson);
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
</script>

<button on:click={downloadFeed}>Download Feed</button>

<div>
	<p>{@html warningMessage}</p>
</div>

<style>
	/* Add your CSS here */
</style>
