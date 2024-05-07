<script>
	import { onMount, onDestroy } from 'svelte';
	import { feedShowNotes } from '$/stores';
	import AddingPrompt from './AddingPrompt.svelte';
	import OverwritePublisher from './OverwritePublisher.svelte';
	import PodcastInfo from './PodcastInfo.svelte';
	import PodcastValue from './PodcastValue.svelte';
	import EpisodeInfo from './EpisodeInfo.svelte';
	import EpisodeValue from './EpisodeValue.svelte';
	import ShowNotes from './ShowNotes.svelte';
	import ChaptersTranscripts from './ChaptersTranscripts.svelte';
	import DownloadFeed from './DownloadFeed.svelte';
	let podcastScreens = [
		AddingPrompt,
		PodcastInfo,
		PodcastValue,
		EpisodeInfo,
		ShowNotes,
		EpisodeValue,
		ChaptersTranscripts,
		DownloadFeed
	];
	let publisherScreens = [OverwritePublisher, PodcastInfo, PodcastValue, DownloadFeed];

	export let showFeedModal;
	export let publisherFeedType;
	let screenIndex = 0;
	let feed = {
		image: { url: '' },
		description: '',
		'itunes:author': '',
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
		'podcast:guid': '',
		generator: 'The Split Kit',
		'itunes:category': { '@_text': 'Music' },
		'itunes:keywords': '',
		'itunes:explicit': 'no'
	};

	// feed = {
	// 	image: { url: 'test' },
	// 	description: 'test',
	// 	'itunes:author': 'test',
	// 	title: 'test',
	// 	link: 'test',
	// 	item: [],
	// 	'podcast:value': {
	// 		'podcast:valueRecipient': [
	// 			{
	// 				'@_name': 'a',
	// 				'@_address': 'a',
	// 				'@_type': 'node',
	// 				'@_customKey': 'a',
	// 				'@_customValue': 'a',
	// 				'@_split': '100'
	// 			}
	// 		],
	// 		'@_type': 'lightning',
	// 		'@_method': 'keysend',
	// 		'@_suggested': '0.00000005000'
	// 	},
	// 	'podcast:medium': 'podcast',
	// 	'podcast:guid': '',
	// 	generator: 'The Split Kit',
	// 	'itunes:category': { '@_text': 'Music' },
	// 	'itunes:keywords': 'test',
	// 	'itunes:explicit': 'no'
	// };
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
		'itunes:explicit': 'no'
	};

	onDestroy(() => {
		$feedShowNotes = '';
	});
</script>

{#if publisherFeedType === 'podcast'}
	<svelte:component
		this={podcastScreens[screenIndex]}
		bind:screenIndex
		bind:feed
		bind:item
		bind:showFeedModal
	/>
{:else if publisherFeedType === 'publisher'}
	<svelte:component
		this={publisherScreens[screenIndex]}
		bind:screenIndex
		bind:feed
		bind:item
		bind:showFeedModal
		bind:publisherFeedType
	/>
{/if}
