<script>
	import AddingPrompt from './AddingPrompt.svelte';
	import Channel from './Channel.svelte';
	import ItemEditor from './Item.svelte';
	import ItemValue from './ItemValue.svelte';
	import ChaptersTranscripts from './ChaptersTranscripts.svelte';
	let screens = [AddingPrompt, Channel, ItemEditor, ItemValue, ChaptersTranscripts];
	let screenIndex = 0;
	let feed = {
		image: { url: '' },
		description: '',
		item: [],
		'podcast:value': {
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
		},
		'podcast:medium': 'podcast',
		'podcast:guid': ''
	};
	let item = {
		title: '',
		'itunes:image': { '@_href': '' },
		description: '',
		guid: {
			'#text': '',
			'@_isPermaLink': 'false'
		},
		'podcast:transcript': {
			'@_url': '',
			'@_type': 'application/x-subrip'
		},
		'podcast:chapters': {
			'@_url': '',
			'@_type': 'application/json'
		},
		enclosure: {
			'@_url': '',
			'@_length': '',
			'@_type': ''
		},
		enclosureUrl: '',
		'podcast:value': {
			'podcast:valueRecipient': [
				{
					'@_name': '',
					'@_address': '',
					'@_type': 'node',
					'@_customKey': '',
					'@_customValue': '',
					'@_split': ''
				},
				{
					'@_name': 'The Split Kit',
					'@_customKey': '696969',
					'@_customValue': 'boPNspwDdt7axih5DfKs',
					'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
					'@_type': 'node',
					'@_split': 5,
					'@_fee': true
				}
			],
			'@_type': 'lightning',
			'@_method': 'keysend',
			'@_suggested': '0.00000005000'
		},
		chaptersUrl: '',
		transcriptsUrl: ''
	};

	console.log(item);
</script>

<svelte:component this={screens[screenIndex]} bind:screenIndex bind:feed bind:item />
