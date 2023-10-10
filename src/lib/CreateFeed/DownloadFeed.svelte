<script>
	export let feed;
	export let item;
	export let screenIndex;
	import clone from 'just-clone';

	let warningMessage = ''; // Initialize as empty string

	function isValidURL(str) {
		try {
			new URL(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	async function verifyFeed() {
		if (!feed.title) {
			warningMessage += 'Your podcast needs a title./n';
		}
		if (!feed?.image?.url) {
			warningMessage += 'Your podcast needs an image./n';
		}
		if (!feed?.link) {
			warningMessage += 'Your podcast needs a website link./n';
		}
		if (!feed?.description) {
			warningMessage += 'Your podcast needs a description./n';
		}
		if (!feed?.['itunes:explicit']) {
			warningMessage += 'Click Yes or No on Podcast Explicit Content/n';
		}

		warningMessage += checkValue(feed, 'podcast');
		if (!item.title) {
			warningMessage += 'Your episode needs a title./n';
		}
		if (!item?.enclosure?.['@_url']) {
			warningMessage += 'Your episode needs an audio file./n';
		}
		if (!item?.duration) {
			warningMessage += 'Click Get Audio Duration for your Episode./n';
		}
		warningMessage += checkValue(item, 'episode');

		console.log(warningMessage);
	}

	async function verifyFile(type) {
		let url = item[`podcast:${type}`]['@_url'];
		warningMessage = '';

		if (!isValidURL(url)) {
			warningMessage = 'Invalid URL';
			return;
		}

		try {
			const response = await fetch(url);
			if (!response.ok) {
				warningMessage = 'No File is returned from that URL';
				return;
			}
			const contentType = response.headers.get('Content-Type');

			if (type === 'chapters') {
				if (!contentType || !contentType.includes('application/json')) {
					warningMessage = "Improper Chapter File Type. Ensure it's a JSON file.";
				}
			} else if (type === 'transcript') {
				if (
					!contentType ||
					(!contentType.includes('application/x-subrip') &&
						!contentType.includes('application/srt'))
				) {
					warningMessage = "Improper Transcript File Type. Ensure it's an SRT file.";
				}
			}
		} catch (error) {
			warningMessage = `An error occurred. <br/> <br/> This is usually because the file doesn't exist <br/> or Cross Origin Resource Sharing (CORS) <br/> is not enabled on your server.`;
		}
	}

	function checkValue(obj, type) {
		console.log(obj);
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
		console.log(value);

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
					totalSplit += recipient['@_split'];
				}
			});

			if (totalSplit !== 100) {
				warning += type.charAt(0).toUpperCase() + type.slice(1) + " splits don't add up to 100%.\n";
			}
		}

		return warning;
	}

	async function downloadFeed() {
		verifyFeed();
		console.log(feed);
		console.log(item);
	}
</script>

<button on:click={downloadFeed}>Download Feed</button>

<div>
	<p>{@html warningMessage}</p>
</div>

<style>
	/* Add your CSS here */
</style>
