<script>
	import { onMount, onDestroy } from 'svelte';
	import { feedShowNotes } from '$/stores';
	import AddingPrompt from './AddingPrompt.svelte';
	import PodcastInfo from './PodcastInfo.svelte';
	import PodcastValue from './PodcastValue.svelte';
	import EpisodeInfo from './EpisodeInfo.svelte';
	import EpisodeValue from './EpisodeValue.svelte';
	import ShowNotes from './ShowNotes.svelte';
	import ChaptersTranscripts from './ChaptersTranscripts.svelte';
	import DownloadFeed from './DownloadFeed.svelte';
	let screens = [
		AddingPrompt,
		PodcastInfo,
		PodcastValue,
		EpisodeInfo,
		ShowNotes,
		EpisodeValue,
		ChaptersTranscripts,
		DownloadFeed
	];
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

	// feed = {
	// 	title: 'Boostagram Ball',
	// 	description: 'The First Podcast with Value4Value Music hosted by Adam Curry',
	// 	language: 'en',
	// 	'itunes:image': {
	// 		'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 	},
	// 	link: 'https://boostagramball.com',
	// 	generator: 'The Split Kit',
	// 	image: {
	// 		url: 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png',
	// 		link: 'https://boostagramball.com',
	// 		title: 'Boostagram Ball',
	// 		description: 'The First Podcast with Value4Value Music hosted by Adam Curry',
	// 		width: 144,
	// 		height: 144
	// 	},
	// 	'itunes:category': 'Music',
	// 	'podcast:medium': 'podcast',
	// 	'podcast:guid': '6dfbd8e4-f9f3-5ea1-98a1-574134999b3b',
	// 	'podcast:images': {
	// 		'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 	},
	// 	'podcast:person': {
	// 		'#text': 'Adam Curry',
	// 		'@_href': 'https://boostagramball.com/',
	// 		'@_img':
	// 			'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 		'@_group': 'cast',
	// 		'@_role': 'host'
	// 	},
	// 	'podcast:value': {
	// 		'podcast:valueRecipient': [
	// 			{
	// 				'@_name': 'Sovereign Feeds',
	// 				'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 				'@_type': 'node',
	// 				'@_customKey': '696969',
	// 				'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 				'@_split': '5'
	// 			},
	// 			{
	// 				'@_name': 'Boostagram Ball',
	// 				'@_type': 'node',
	// 				'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 				'@_split': '90'
	// 			},
	// 			{
	// 				'@_name': 'IPFSPodcasting.net',
	// 				'@_type': 'node',
	// 				'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 				'@_split': '5'
	// 			}
	// 		],
	// 		'@_type': 'lightning',
	// 		'@_method': 'keysend',
	// 		'@_suggested': '0.00000005000'
	// 	},
	// 	'podcast:complete': 'no',
	// 	'podcast:block': 'no',
	// 	'itunes:owner': {
	// 		'itunes:email': 'adam@curry.com',
	// 		'itunes:name': 'Adam Curry'
	// 	},
	// 	'itunes:keywords':
	// 		'adam curry boost boostagram ball value4value bitcoin music satoshis podcasting 2.0',
	// 	'itunes:author': 'Adam Curry',
	// 	managingEditor: 'Adam Curry',
	// 	pubDate: 'Wed, 04 Oct 2023 21:25:11 +0000',
	// 	lastBuildDate: 'Wed, 04 Oct 2023 21:25:11 +0000',
	// 	'podcast:liveItem': {
	// 		title: 'Boostagram Ball Episode 10 Live',
	// 		'podcast:liveValue': {
	// 			'@_uri': 'https://curiohoster.com/event?event_id=58a0bed1-71ae-449d-ac07-fa558469e3cc',
	// 			'@_protocol': 'socket.io'
	// 		},
	// 		description:
	// 			'<p>The Boostagram Ball Live Episode 10</p>\n<p>October 4th 2023</p>\n<p>Use a modern app at podcastapps.com to listen live and support the artists</p>\n<p>curiocaster.com supports the live stream</p>\n<p>You can also go to http://live.boostagramball.com and connect to your alby wallet</p>',
	// 		enclosure: {
	// 			'@_length': '33',
	// 			'@_type': 'audio/mpeg',
	// 			'@_url': 'https://op3.dev/e/ipfspodcasting.net/e/listen.noagendastream.com/noagenda'
	// 		},
	// 		guid: {
	// 			'#text': 'e0aa4970-af21-4c50-983b-0748e5d70cfe',
	// 			'@_isPermaLink': 'false'
	// 		},
	// 		'itunes:image': {
	// 			'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 		},
	// 		'itunes:subtitle': 'Boostagram Ball Episode 10 Live',
	// 		'itunes:summary':
	// 			'<p>The Boostagram Ball Live Episode 10</p>\n<p>October 4th 2023</p>\n<p>Use a modern app at podcastapps.com to listen live and support the artists</p>\n<p>curiocaster.com supports the live stream</p>\n<p>You can also go to http://live.boostagramball.com and connect to your alby wallet</p>',
	// 		link: 'http://live.boostagramball.com',
	// 		'podcast:contentLink': {
	// 			'#text': 'Listen Live Here:',
	// 			'@_href': 'https://www.thesplitkit.com/live/58a0bed1-71ae-449d-ac07-fa558469e3cc'
	// 		},
	// 		'podcast:person': {
	// 			'#text': 'Adam Curry',
	// 			'@_href': 'https://boostagramball.com/',
	// 			'@_img':
	// 				'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 			'@_group': 'cast',
	// 			'@_role': 'host'
	// 		},
	// 		'podcast:images': {
	// 			'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 		},
	// 		'podcast:chat': {
	// 			'@_server': 'irc.zeronode.net',
	// 			'@_protocol': 'irc',
	// 			'@_accountId': 'adamc1999',
	// 			'@_space': '#NoAgenda',
	// 			'@_embedUrl': 'https://kiwiirc.com/nextclient/irc.zeronode.net/?nick=webtroll?#NoAgenda'
	// 		},
	// 		'podcast:value': {
	// 			'podcast:valueRecipient': [
	// 				{
	// 					'@_name': 'Sovereign Feeds',
	// 					'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 					'@_type': 'node',
	// 					'@_customKey': '696969',
	// 					'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 					'@_split': '5'
	// 				},
	// 				{
	// 					'@_name': 'Boostagram Ball',
	// 					'@_type': 'node',
	// 					'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 					'@_split': '93'
	// 				},
	// 				{
	// 					'@_name': 'Boostbot',
	// 					'@_type': 'node',
	// 					'@_address': '03d55f4d4c870577e98ac56605a54c5ed20c8897e41197a068fd61bdb580efaa67',
	// 					'@_split': '1'
	// 				},
	// 				{
	// 					'@_name': 'Fountain Bot',
	// 					'@_type': 'node',
	// 					'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 					'@_customKey': '112111100',
	// 					'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 					'@_split': '1'
	// 				}
	// 			],
	// 			'@_type': 'lightning',
	// 			'@_method': 'keysend',
	// 			'@_suggested': '0.00000005000'
	// 		},
	// 		'@_status': 'ended',
	// 		'@_start': '2023-10-04T19:55:00.000Z',
	// 		'@_end': '2023-10-04T21:25:00.000Z'
	// 	},
	// 	item: [
	// 		{
	// 			title: 'Boostagram Ball - Episode 10',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 10 for October 4th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Back Road</a><br /><a href="https://www.wavlake.com/album/a4fcb9bd-6549-482b-8f85-542281254da0">Richard - Rules Without Rulers</a><br /><a href="https://www.wavlake.com/album/11557399-4f45-446e-8b57-69d9c42a8ed5">Ainsley Costello - Rescued</a><br /><a href="https://noagendasocial.com/@shredward">CityBeach - GO</a><br /><a href="https://www.wavlake.com/album/e6a50ff6-8e1b-445f-a9ef-21096af86e49">Ryan Fonda - Only A Call Away</a><br /><a href="https://www.wavlake.com/album/47bc7992-48ad-4a4b-907c-9972490bcdba">Drawing Monsters - Tiny Ships</a><br /><a href="https://www.wavlake.com/album/d1ed0ec9-21a8-4eda-b2c9-b17c8019a7e8">PlebRap - Money Printer Go - Too Bit to Fail</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/d985e900-4bf0-4275-a02e-0aab09cdbcd9">Mr. Information - Mr. J</a><br /><a href="https://www.wavlake.com/album/a9e7c186-c60e-403c-8175-183b8c270d26">Enid Mollel - Fly (feat B. LEO)</a><br /><a href="https://www.wavlake.com/album/fb3d61d3-866a-4699-a6e9-b7edfdc11069">Bobby Shell - Beefsteak and Tradwives</a><br /><a href="https://www.wavlake.com/album/699644a5-a5b4-4c2d-ad70-e90977e60c34">Sara Jade - Wait Destiny</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.youtube.com/watch?v=lMSw6Bwq0TE&list=OLAK5uy_mEIaceZKkMUXQuEHAaKtuvLEP0YemALtE&index=1">Choreboy - We\'re in It for the Money</a><br /><a href="https://www.wavlake.com/album/5890a4d1-0f8f-45e9-ad46-72bf6f79853d">Jessica Lynne Witty - We\'re Not Even Drinking</a><br /><a href="https://www.wavlake.com/album/09298530-2134-45b0-898f-08f63348bc57">Jeremy Oliveria - Looking For You (Feat. Kellin Quinn)</a></p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-10-2023-10-04-Final.mp3',
	// 				'@_length': '86836498',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/111178852120098594',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-10-Captions.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-10-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': '5f1bd44d-bcf1-40a3-aaca-c45d5c4c0bf4',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 10',
	// 			pubDate: 'Wed, 04 Oct 2023 21:13:54 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 10 for October 4th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Back Road</a><br /><a href="https://www.wavlake.com/album/a4fcb9bd-6549-482b-8f85-542281254da0">Richard - Rules Without Rulers</a><br /><a href="https://www.wavlake.com/album/11557399-4f45-446e-8b57-69d9c42a8ed5">Ainsley Costello - Rescued</a><br /><a href="https://noagendasocial.com/@shredward">CityBeach - GO</a><br /><a href="https://www.wavlake.com/album/e6a50ff6-8e1b-445f-a9ef-21096af86e49">Ryan Fonda - Only A Call Away</a><br /><a href="https://www.wavlake.com/album/47bc7992-48ad-4a4b-907c-9972490bcdba">Drawing Monsters - Tiny Ships</a><br /><a href="https://www.wavlake.com/album/d1ed0ec9-21a8-4eda-b2c9-b17c8019a7e8">PlebRap - Money Printer Go - Too Bit to Fail</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/d985e900-4bf0-4275-a02e-0aab09cdbcd9">Mr. Information - Mr. J</a><br /><a href="https://www.wavlake.com/album/a9e7c186-c60e-403c-8175-183b8c270d26">Enid Mollel - Fly (feat B. LEO)</a><br /><a href="https://www.wavlake.com/album/fb3d61d3-866a-4699-a6e9-b7edfdc11069">Bobby Shell - Beefsteak and Tradwives</a><br /><a href="https://www.wavlake.com/album/699644a5-a5b4-4c2d-ad70-e90977e60c34">Sara Jade - Wait Destiny</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.youtube.com/watch?v=lMSw6Bwq0TE&list=OLAK5uy_mEIaceZKkMUXQuEHAaKtuvLEP0YemALtE&index=1">Choreboy - We\'re in It for the Money</a><br /><a href="https://www.wavlake.com/album/5890a4d1-0f8f-45e9-ad46-72bf6f79853d">Jessica Lynne Witty - We\'re Not Even Drinking</a><br /><a href="https://www.wavlake.com/album/09298530-2134-45b0-898f-08f63348bc57">Jeremy Oliveria - Looking For You (Feat. Kellin Quinn)</a></p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3615,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-10/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '537df90e-0cc4-535b-84d0-dcb3ca87f1f8',
	// 							'@_itemGuid': '1ea099a5-bb58-493a-ba4f-fa3e47502f60'
	// 						},
	// 						'@_startTime': '20.051',
	// 						'@_duration': '98.35102',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '7891de21-7e3f-5d3c-b0d3-fcafd4537777',
	// 							'@_itemGuid': '693daffc-3b45-44ab-a5f2-6c2246d1c8c8'
	// 						},
	// 						'@_startTime': '117',
	// 						'@_duration': '96.026',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a24fe7d6-3bce-50ef-90d8-62b40794c00d',
	// 							'@_itemGuid': '604d03b2-35ba-45d9-a00e-4c0ca409e670'
	// 						},
	// 						'@_startTime': '212',
	// 						'@_duration': '241.554',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '1e7ed1fa-0456-5860-9b34-825d1335d8f8',
	// 							'@_itemGuid': '68da0640-fa3d-44a5-9009-3ade96a81a1b'
	// 						},
	// 						'@_startTime': '582',
	// 						'@_duration': '253.753',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '65cd72e4-fc7b-595d-baee-6c35feba420a',
	// 							'@_itemGuid': 'd186993b-5230-43a2-aefb-418d79e03c6a'
	// 						},
	// 						'@_startTime': '842',
	// 						'@_duration': '245.447',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '3aea8c54-1f96-5917-9f49-d72b2941547c',
	// 							'@_itemGuid': 'bf9188a7-f3a3-4ee5-9f21-555ef948bff5'
	// 						},
	// 						'@_startTime': '1073',
	// 						'@_duration': '241.032',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '47081700-bd65-511f-b535-f545f3cd660c',
	// 							'@_itemGuid': '7b03666e-b323-499d-93a7-ca51ce627ffd'
	// 						},
	// 						'@_startTime': '1313',
	// 						'@_duration': '152.581',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8b6971e-403e-568f-a4e6-7aa2b45e50d4',
	// 							'@_itemGuid': '72a3b402-8491-4cd9-823e-a621fd81b86f'
	// 						},
	// 						'@_startTime': '1595',
	// 						'@_duration': '216.059',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '2891df06-9fd1-5681-a95e-a82c93cac74d',
	// 							'@_itemGuid': '5bb13b47-5d88-4152-8bca-3b2a01316488'
	// 						},
	// 						'@_startTime': '1838',
	// 						'@_duration': '233.848',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '0e346ae4-651a-52ca-a916-512c32e23d0b',
	// 							'@_itemGuid': '32cd383d-f0c3-4b4d-8243-37816e234c81'
	// 						},
	// 						'@_startTime': '2064',
	// 						'@_duration': '176.927',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '7f62ae77-b865-5933-8fd5-ee634ea03b7f',
	// 							'@_itemGuid': '3bfb9c1c-b929-42f8-8832-6f6adc01017e'
	// 						},
	// 						'@_startTime': '2324',
	// 						'@_duration': '176.98',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '45874e17-fdfb-5693-a817-5e584da20e5b',
	// 							'@_itemGuid': 'e646b30a-2007-4086-b35b-58570c33c159'
	// 						},
	// 						'@_startTime': '2500',
	// 						'@_duration': '156.336',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '8d3a94a0-3195-52f4-9bb9-c3f5ea776e1c',
	// 							'@_itemGuid': '661bbac0-b505-4273-8fb6-2a5d6f47dcc4'
	// 						},
	// 						'@_startTime': '2740',
	// 						'@_duration': '212.872',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ac3e102d-5cb8-58d0-b37a-3f7cb2d47094',
	// 							'@_itemGuid': 'b9da9858-7bf1-4f3e-ac8c-5074c6f45d0c'
	// 						},
	// 						'@_startTime': '2953',
	// 						'@_duration': '124.712',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b34b055b-d3c8-58d5-ad6e-d791b0caaf1e',
	// 							'@_itemGuid': '3ec74345-4f25-4481-8f62-e20b7929ab12'
	// 						},
	// 						'@_startTime': '3079',
	// 						'@_duration': '141.845',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '94661b95-cae4-5f47-a599-ed27d530dfa2',
	// 							'@_itemGuid': 'ba1796d0-5c80-4ccf-9c75-24c87c6dbad4'
	// 						},
	// 						'@_startTime': '3416',
	// 						'@_duration': '252.48',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 09',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 08 for September 25th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - A Little Rock And Roll</a><br /><a href="https://www.wavlake.com/album/f795807c-81b8-4971-bfb7-7ff064bfbf8a">DEVOTEE - Beautiful Ghost</a><br /><a href="https://www.wavlake.com/album/bebc84f9-b692-4e37-b297-b4c053e09d88">Minno - Give My Life</a><br /><a href="https://www.wavlake.com/album/11557399-4f45-446e-8b57-69d9c42a8ed5">Ainsley Costello - Rescued</a><br /><a href="https://chriswenske.com/">Chris Wenske - Coconuts</a><br /><a href="https://www.wavlake.com/album/78c91892-3e58-40c4-b61e-68d5a5a4d8b7">Ali Mitchell - Wen this is over</a><br /><a href="https://www.youtube.com/@thisisjdog81">Jdog - Once Had A Girl</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.wavlake.com/album/0a108b1e-1bd0-4670-8c90-1c1df72da842">tom335 - Rain</a><br /><a href="https://www.wavlake.com/album/d985e900-4bf0-4275-a02e-0aab09cdbcd9">Mr. Information - Utterly Nothing</a><br /><a href="https://justcast.com/shows/44721/audioposts/1246165">Robert Willey - That\'s How It Goes</a><br /><a href="https://www.wavlake.com/album/b2386ccd-d73b-4c55-91d6-11afff2269ff">Charles Street Sound Company - Money In A Bag</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/9e426280-9993-4c62-8c6f-e43111e28a5f">shy kids - fresh off a feeling</a><br /><a href="https://www.wavlake.com/album/b693cfce-3dff-42c1-8912-1913a267cee4">Josh & Aus - Coldwater</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a></p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-09-2023-09-25-Final.mp3',
	// 				'@_length': '87488514',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/111128111648849033',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-09-Captions.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-09-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'fdf36e92-f85a-4e13-8709-1c9b093048c6',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 09',
	// 			pubDate: 'Mon, 25 Sep 2023 22:14:30 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 08 for September 25th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - A Little Rock And Roll</a><br /><a href="https://www.wavlake.com/album/f795807c-81b8-4971-bfb7-7ff064bfbf8a">DEVOTEE - Beautiful Ghost</a><br /><a href="https://www.wavlake.com/album/bebc84f9-b692-4e37-b297-b4c053e09d88">Minno - Give My Life</a><br /><a href="https://www.wavlake.com/album/11557399-4f45-446e-8b57-69d9c42a8ed5">Ainsley Costello - Rescued</a><br /><a href="https://chriswenske.com/">Chris Wenske - Coconuts</a><br /><a href="https://www.wavlake.com/album/78c91892-3e58-40c4-b61e-68d5a5a4d8b7">Ali Mitchell - Wen this is over</a><br /><a href="https://www.youtube.com/@thisisjdog81">Jdog - Once Had A Girl</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.wavlake.com/album/0a108b1e-1bd0-4670-8c90-1c1df72da842">tom335 - Rain</a><br /><a href="https://www.wavlake.com/album/d985e900-4bf0-4275-a02e-0aab09cdbcd9">Mr. Information - Utterly Nothing</a><br /><a href="https://justcast.com/shows/44721/audioposts/1246165">Robert Willey - That\'s How It Goes</a><br /><a href="https://www.wavlake.com/album/b2386ccd-d73b-4c55-91d6-11afff2269ff">Charles Street Sound Company - Money In A Bag</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/9e426280-9993-4c62-8c6f-e43111e28a5f">shy kids - fresh off a feeling</a><br /><a href="https://www.wavlake.com/album/b693cfce-3dff-42c1-8912-1913a267cee4">Josh & Aus - Coldwater</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a></p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3643,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-09/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0d74358-6d3a-5c8a-86e7-9192ca57775e',
	// 							'@_itemGuid': '6b3c4f4e-3b87-4ed3-89be-5f5feae71976'
	// 						},
	// 						'@_startTime': '11.376',
	// 						'@_duration': '151.484',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '7a77edc0-15a5-5d27-8448-115065ca04cf',
	// 							'@_itemGuid': 'a5385f38-c14c-4c97-bc53-356ab83b78b4'
	// 						},
	// 						'@_startTime': '161.126',
	// 						'@_duration': '177.912',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '7da968f9-c207-5b8a-b522-690dd425e83d',
	// 							'@_itemGuid': '52cf671f-0065-4037-bde4-931b6314ab96'
	// 						},
	// 						'@_startTime': '335.376',
	// 						'@_duration': '238.864',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a24fe7d6-3bce-50ef-90d8-62b40794c00d',
	// 							'@_itemGuid': '604d03b2-35ba-45d9-a00e-4c0ca409e670'
	// 						},
	// 						'@_startTime': '704.151',
	// 						'@_duration': '241.554',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd50e670d-282f-5892-a360-ff407f5da2a2',
	// 							'@_itemGuid': 'a196d8b9-fee3-4e9b-9511-5b5ac48654d8'
	// 						},
	// 						'@_startTime': '942.576',
	// 						'@_duration': '175.183',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '18e9e127-196b-5775-9662-5f6dee6b7a94',
	// 							'@_itemGuid': 'c6cb7c68-9997-4ee5-aaf6-34186395cbb6'
	// 						},
	// 						'@_startTime': '1112.376',
	// 						'@_duration': '220.056',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a599fabe-6b73-58f3-88b8-a7b78a2976b5',
	// 							'@_itemGuid': '660c8516-ba38-480a-9ce7-e70a17427842'
	// 						},
	// 						'@_startTime': '1463.401',
	// 						'@_duration': '107.928',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '08604071-83cc-5810-bec2-bea0f0cd0033',
	// 							'@_itemGuid': 'd1964967-62f1-4b63-9225-a365c79f9cc4'
	// 						},
	// 						'@_startTime': '1571.325',
	// 						'@_duration': '174.408',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '04f0e777-881e-5425-b26e-4e3fe0a0831e',
	// 							'@_itemGuid': '66dcce12-ca2d-4709-b1d1-324211ccd89e'
	// 						},
	// 						'@_startTime': '1740.176',
	// 						'@_duration': '127.056',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '2891df06-9fd1-5681-a95e-a82c93cac74d',
	// 							'@_itemGuid': '4912cea8-7056-44af-88dc-8a3ddc46a602'
	// 						},
	// 						'@_startTime': '1861.735',
	// 						'@_duration': '99.474',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd577b6cd-8c41-548b-abba-60e1502a94df',
	// 							'@_itemGuid': 'https://justcast.com/shows/44721/audioposts/1246165'
	// 						},
	// 						'@_startTime': '2045.502',
	// 						'@_duration': '313.078',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffbd20cd-5132-5c7f-a324-6c4fac956340',
	// 							'@_itemGuid': '9eef5cc8-9ffd-4372-ab74-d0a80d3f9275'
	// 						},
	// 						'@_startTime': '2446.026',
	// 						'@_duration': '328.098',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8b6971e-403e-568f-a4e6-7aa2b45e50d4',
	// 							'@_itemGuid': '72a3b402-8491-4cd9-823e-a621fd81b86f'
	// 						},
	// 						'@_startTime': '2762.876',
	// 						'@_duration': '216.059',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5f073fbd-f8f3-5488-8ab1-701aee7bbeeb',
	// 							'@_itemGuid': '850eced6-44fb-4a49-8e9a-3b6e718f19d0'
	// 						},
	// 						'@_startTime': '3093.977',
	// 						'@_duration': '185.376',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'f4fae524-f4e5-57df-9cd2-eb90269a05a0',
	// 							'@_itemGuid': '8d2cc176-49dc-4665-8a74-d4b611c88dc4'
	// 						},
	// 						'@_startTime': '3240.777',
	// 						'@_duration': '136.647',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '57203632-2003-55d2-b710-c699db963f18',
	// 							'@_itemGuid': 'b66d8b6c-686d-45e0-804a-1881b9b519ce'
	// 						},
	// 						'@_startTime': '3407.451',
	// 						'@_duration': '227.892',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 08',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 08 for September 18th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Not On The Radio (Acoustic)</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Late</a><br /><a href="https://www.wavlake.com/album/1e0e29c2-f05d-42a6-8b6e-acbfe2b29318">Ollie - Lowkey</a><br /><a href="https://www.wavlake.com/album/2379d06f-4430-4d9f-972a-2b98387ce472">Chris Nichols - Elevator Music</a><br /><a href="https://www.wavlake.com/album/e0e7c31e-0e19-4b89-8bca-141a61c24a5d">Riot in Progress - Spank The Monkey</a><br /><a href="https://www.youtube.com/watch?v=lMSw6Bwq0TE&list=OLAK5uy_mEIaceZKkMUXQuEHAaKtuvLEP0YemALtE&index=1">Choreboy - We\'re in It for the Money</a><br /><a href="https://www.wavlake.com/album/5917663e-8d6e-45be-a364-01dfcdd26b4f">bennyjeans - WHY (did you do this to me)</a><br /><a href="https://podverse.fm/podcast/yK1ScNbZTc">The Doerfels - Thought it was Real</a><br /><a href="https://www.wavlake.com/album/b48e7695-48a4-41ec-a135-d0c77a561662">Raymond Hayden - Weight of the World ft Chris Jones</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.wavlake.com/album/9a378ad7-7de6-4cc6-90e4-0ce2d8c0c6b2">Deez Laughs aka wrapthenews - Sweet</a><br /><a href="https://www.wavlake.com/album/4e3cd92d-d36b-42d5-8333-824901160fac">Jessica Lynne Witty - Keep Going</a><br /><a href="https://www.wavlake.com/album/c3f0151d-c153-445f-81f7-a104a84703f5">skrilla bobcat - Pick me up (Mary Lightning Fire)</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-08-2023-09-18-Final.mp3',
	// 				'@_length': '64968873',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/111088507135447444',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-08-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-08-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'be95e260-383a-4eb4-a8f0-af97c6524f62',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 08',
	// 			pubDate: 'Mon, 18 Sep 2023 22:22:48 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 08 for September 18th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Not On The Radio (Acoustic)</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Late</a><br /><a href="https://www.wavlake.com/album/1e0e29c2-f05d-42a6-8b6e-acbfe2b29318">Ollie - Lowkey</a><br /><a href="https://www.wavlake.com/album/2379d06f-4430-4d9f-972a-2b98387ce472">Chris Nichols - Elevator Music</a><br /><a href="https://www.wavlake.com/album/e0e7c31e-0e19-4b89-8bca-141a61c24a5d">Riot in Progress - Spank The Monkey</a><br /><a href="https://www.youtube.com/watch?v=lMSw6Bwq0TE&list=OLAK5uy_mEIaceZKkMUXQuEHAaKtuvLEP0YemALtE&index=1">Choreboy - We\'re in It for the Money</a><br /><a href="https://www.wavlake.com/album/5917663e-8d6e-45be-a364-01dfcdd26b4f">bennyjeans - WHY (did you do this to me)</a><br /><a href="https://podverse.fm/podcast/yK1ScNbZTc">The Doerfels - Thought it was Real</a><br /><a href="https://www.wavlake.com/album/b48e7695-48a4-41ec-a135-d0c77a561662">Raymond Hayden - Weight of the World ft Chris Jones</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.wavlake.com/album/9a378ad7-7de6-4cc6-90e4-0ce2d8c0c6b2">Deez Laughs aka wrapthenews - Sweet</a><br /><a href="https://www.wavlake.com/album/4e3cd92d-d36b-42d5-8333-824901160fac">Jessica Lynne Witty - Keep Going</a><br /><a href="https://www.wavlake.com/album/c3f0151d-c153-445f-81f7-a104a84703f5">skrilla bobcat - Pick me up (Mary Lightning Fire)</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 4056,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-08/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0d74358-6d3a-5c8a-86e7-9192ca57775e',
	// 							'@_itemGuid': '88614c17-ce82-470b-bee2-4b51a16fb7f9'
	// 						},
	// 						'@_startTime': '11.502',
	// 						'@_duration': '208.666',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '537df90e-0cc4-535b-84d0-dcb3ca87f1f8',
	// 							'@_itemGuid': '7ad63686-68ca-49fb-b5f3-a5426f1e87c9'
	// 						},
	// 						'@_startTime': '214.852',
	// 						'@_duration': '188.735',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '60e9fcee-0285-5ba9-870f-7e4c381ef846',
	// 							'@_itemGuid': '4554be73-db5e-40b1-aa1f-ff34fe39f1bf'
	// 						},
	// 						'@_startTime': '401.151',
	// 						'@_duration': '133.93',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '114ede6e-9bbb-5e40-ad25-0cb714a48a4c',
	// 							'@_itemGuid': '23627d05-7f8c-47c1-acd8-7a81cb7e3340'
	// 						},
	// 						'@_startTime': '618.626',
	// 						'@_duration': '178.051',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '203e5583-5d90-5360-bf1d-aee49e1f8a85',
	// 							'@_itemGuid': '255ec38c-6e8c-4d18-ad79-296519cf2a3c'
	// 						},
	// 						'@_startTime': '797.828',
	// 						'@_duration': '201.482',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ac3e102d-5cb8-58d0-b37a-3f7cb2d47094',
	// 							'@_itemGuid': 'b9da9858-7bf1-4f3e-ac8c-5074c6f45d0c'
	// 						},
	// 						'@_startTime': '997.926',
	// 						'@_duration': '124.712',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '25de7384-5134-545b-8069-c67c9523f851',
	// 							'@_itemGuid': '0fff4168-0576-4289-abd9-c37b278df12c'
	// 						},
	// 						'@_startTime': '1219.401',
	// 						'@_duration': '201.038',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '68c2dcdc-d955-5a37-8ac1-7a9d18631878',
	// 							'@_itemGuid': '7d5d9cdd-3cb5-4202-a58b-a878d7c6fa04'
	// 						},
	// 						'@_startTime': '1420.427',
	// 						'@_duration': '192.967',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ec442261-9e1f-5dd2-9941-0fe0c851eb89',
	// 							'@_itemGuid': 'd243a428-71f4-42ac-aabd-35e0e9fb2a8f'
	// 						},
	// 						'@_startTime': '1688.651',
	// 						'@_duration': '297.691',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffcb1ad3-a609-52de-bdc8-b8ba5f408f06',
	// 							'@_itemGuid': 'e8b7f53e-6d20-417d-8ede-dafdac6e6b46'
	// 						},
	// 						'@_startTime': '1981.126',
	// 						'@_duration': '280.451',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '08604071-83cc-5810-bec2-bea0f0cd0033',
	// 							'@_itemGuid': 'd1964967-62f1-4b63-9225-a365c79f9cc4'
	// 						},
	// 						'@_startTime': '2392.877',
	// 						'@_duration': '174.408',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '8d3a94a0-3195-52f4-9bb9-c3f5ea776e1c',
	// 							'@_itemGuid': '661bbac0-b505-4273-8fb6-2a5d6f47dcc4'
	// 						},
	// 						'@_startTime': '2561.026',
	// 						'@_duration': '212.872',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '493d99e6-45cb-5519-b095-ef57b52e6c60',
	// 							'@_itemGuid': '1a7797b8-1ff5-46c8-aea0-f4bb9dde1d6a'
	// 						},
	// 						'@_startTime': '2822.877',
	// 						'@_duration': '217.13',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4da9ed1a-5c3e-57c9-958f-3ed36880a26a',
	// 							'@_itemGuid': '8cc4281d-b82b-4631-800c-36becae784d8'
	// 						},
	// 						'@_startTime': '3022.102',
	// 						'@_duration': '106.736',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '79720bc8-6cb1-5ab4-a610-7576c78f660d',
	// 							'@_itemGuid': '946f31fa-c2e4-4861-b200-ee40545e32ca'
	// 						},
	// 						'@_startTime': '3125.451',
	// 						'@_duration': '233.874',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '94bc4847-e2e8-55d9-9a47-3a720a367a0e',
	// 							'@_itemGuid': '957d0dfb-9bde-4c39-b063-2f6bc1db197b'
	// 						},
	// 						'@_startTime': '3485.052',
	// 						'@_duration': '218.514',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '712c5393-aa44-5c3f-9db6-2a09b2c2fb07',
	// 							'@_itemGuid': '8595ef06-ee89-4d06-9abd-abeed3a098b4'
	// 						},
	// 						'@_startTime': '3693.426',
	// 						'@_duration': '354.194',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 07',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 07 for September 11th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Fooling\' No One</a><br /><a href="https://www.wavlake.com/album/cbcbb39b-003d-46d1-8286-d3af3bd7a37a">Jon Ross - Work Sucks</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://noagendasocial.com/@shredward">CityBeach - You</a><br /><a href="https://www.wavlake.com/album/431d0502-f5af-4cf8-92c7-813ca9e38a8c">FM Rodeo - Pop Song</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Late</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.leuenbergmusic.com/">Christian Leuenberg - Halt mich fest</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.wavlake.com/album/a7f20598-dcf0-4e35-a295-ad5fd2f4a036">Spike Yee & Proper - Moving in Sequence w/ Proper</a><br /><a href="https://www.youtube.com/@thisisjdog81">Jdog - Ring That Bell</a><br /><a href="https://www.wavlake.com/album/b014de79-af11-4a40-b8e8-a55932297b8d">Chris Wenske - I Was Wrong</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/699644a5-a5b4-4c2d-ad70-e90977e60c34">Sara Jade - Wait Destiny</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-07-2023-09-11-Final.mp3',
	// 				'@_length': '57769108',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/111048834580544718',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-07-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-07-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': '7a3bdfc5-6b8d-41c4-9493-9f0ea4061bdf-x',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 07',
	// 			pubDate: 'Mon, 11 Sep 2023 22:10:59 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 07 for September 11th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Fooling\' No One</a><br /><a href="https://www.wavlake.com/album/cbcbb39b-003d-46d1-8286-d3af3bd7a37a">Jon Ross - Work Sucks</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://noagendasocial.com/@shredward">CityBeach - You</a><br /><a href="https://www.wavlake.com/album/431d0502-f5af-4cf8-92c7-813ca9e38a8c">FM Rodeo - Pop Song</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Late</a><br /><a href="https://www.doerfelverse.com/">Ben Doerfel - Pulls Me Up</a><br /><a href="https://www.leuenbergmusic.com/">Christian Leuenberg - Halt mich fest</a><br /><a href="https://www.wavlake.com/album/b580956b-4a49-4480-bdcd-c47c51ba2509">Mandelbro - Eyes</a><br /><a href="https://www.wavlake.com/album/a7f20598-dcf0-4e35-a295-ad5fd2f4a036">Spike Yee & Proper - Moving in Sequence w/ Proper</a><br /><a href="https://www.youtube.com/@thisisjdog81">Jdog - Ring That Bell</a><br /><a href="https://www.wavlake.com/album/b014de79-af11-4a40-b8e8-a55932297b8d">Chris Wenske - I Was Wrong</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/699644a5-a5b4-4c2d-ad70-e90977e60c34">Sara Jade - Wait Destiny</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6594066">https://podcastindex.org/podcast/6594066</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3606,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-07/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0d74358-6d3a-5c8a-86e7-9192ca57775e',
	// 							'@_itemGuid': '2e49f3f6-266e-416d-8f12-ec66861b0580'
	// 						},
	// 						'@_startTime': '13',
	// 						'@_duration': '128.287',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'bb820c11-1e77-5f96-a3bd-ca1ff4e8510e',
	// 							'@_itemGuid': '77b84175-06a9-401b-b58f-f91e0c38dc75'
	// 						},
	// 						'@_startTime': '314.701',
	// 						'@_duration': '217.338776',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5ffbb078-b21b-545a-b01e-d3aaa3b3b4c5',
	// 							'@_itemGuid': '92627677-4f5b-4420-85cd-e76b5f9aa7fb'
	// 						},
	// 						'@_startTime': '653.776',
	// 						'@_duration': '258.247',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5bb8f186-2460-54dc-911d-54f642e8adf6',
	// 							'@_itemGuid': 'f69cd5a5-2018-411b-afc1-00ab12142e83'
	// 						},
	// 						'@_startTime': '904.327',
	// 						'@_duration': '273.48',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '84c4d46d-4155-5f9f-a6b6-2a01c3440dcf',
	// 							'@_itemGuid': '3ef2da90-57be-4614-aa7d-24ceeb19a5e4'
	// 						},
	// 						'@_startTime': '1178.876',
	// 						'@_duration': '180.336',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '537df90e-0cc4-535b-84d0-dcb3ca87f1f8',
	// 							'@_itemGuid': '7ad63686-68ca-49fb-b5f3-a5426f1e87c9'
	// 						},
	// 						'@_startTime': '1445.802',
	// 						'@_duration': '188.735',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '08604071-83cc-5810-bec2-bea0f0cd0033',
	// 							'@_itemGuid': 'd1964967-62f1-4b63-9225-a365c79f9cc4'
	// 						},
	// 						'@_startTime': '1633.336',
	// 						'@_duration': '174.408',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4bf9803a-0f23-5065-8688-bd4a2315136f',
	// 							'@_itemGuid': '01haltmichfest'
	// 						},
	// 						'@_startTime': '1939.701',
	// 						'@_duration': '185.603',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '8d3a94a0-3195-52f4-9bb9-c3f5ea776e1c',
	// 							'@_itemGuid': '661bbac0-b505-4273-8fb6-2a5d6f47dcc4'
	// 						},
	// 						'@_startTime': '2121.302',
	// 						'@_duration': '212.872',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '2911ba9d-82e5-5a66-ac72-ead7c97e5013',
	// 							'@_itemGuid': 'e08a8b67-6d65-4153-b244-112c984d289f'
	// 						},
	// 						'@_startTime': '2467.051',
	// 						'@_duration': '181.499',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a599fabe-6b73-58f3-88b8-a7b78a2976b5',
	// 							'@_itemGuid': '849fa935-bf48-49c6-89e8-5d5b8dd024a2'
	// 						},
	// 						'@_startTime': '2685.177',
	// 						'@_duration': '74.448',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4be5ac31-04de-5390-a0f5-0e3993289f60',
	// 							'@_itemGuid': '3891037e-1e3d-42f9-a3dd-a9154f54f56a'
	// 						},
	// 						'@_startTime': '2759.877',
	// 						'@_duration': '156.865',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '2924.353',
	// 						'@_duration': '170.762',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '45874e17-fdfb-5693-a817-5e584da20e5b',
	// 							'@_itemGuid': 'e646b30a-2007-4086-b35b-58570c33c159'
	// 						},
	// 						'@_startTime': '3093',
	// 						'@_duration': '156.336',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8b6971e-403e-568f-a4e6-7aa2b45e50d4',
	// 							'@_itemGuid': '72a3b402-8491-4cd9-823e-a621fd81b86f'
	// 						},
	// 						'@_startTime': '3379.502',
	// 						'@_duration': '216.059',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 06',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 06 for September 4th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://podcastindex.org/podcast/6459959">Rusty Gate - Girl Like Me</a><br /><a href="https://podcastindex.org/podcast/6560804">Sir Brian with an I - Rockstar</a><br /><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - I Wanna Dance</a><br /><a href="https://www.wavlake.com/album/a047ea02-7c6b-4180-939d-6207ab17b9aa">Jimmy V - Fool me</a><br /><a href="https://www.wavlake.com/album/abf00d67-a2f5-4a0f-bd5b-c24da86fe043">Deez Laughs aka wrapthenews - Waves (freestyle)</a><br /><a href="https://www.wavlake.com/album/d7f3854c-a14e-447f-92ea-aa618184721a">DEVOTEE - Such A Dreamer</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Gravity</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Figured You Out</a><br /><a href="https://www.wavlake.com/album/ad487bb8-190c-42b6-b942-b78743085e3c">Tis Tis - Another</a><br /><a href="https://podcastindex.org/podcast/6571305">The Death of Rock and Roll - Pulling Rank</a><br /><a href="https://www.wavlake.com/album/cbcbb39b-003d-46d1-8286-d3af3bd7a37a">Jon Ross - Work Sucks</a><br /><a href="https://www.wavlake.com/album/fd268912-4018-4088-a502-fa3e1aec10c6">Silver Unit - Realtime</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a><br /><a href="https://www.wavlake.com/album/7305e2eb-fe96-46c4-b945-b07dfb8439fd">Ryan Fonda - Bright Lights</a><br /><a href="https://www.wavlake.com/album/ff1244f7-5532-47a8-b903-fadab4d4ad77">Amber Sweeney - Breathe</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podverse.fm/episode/ovlSm2_j1">https://podverse.fm/episode/ovlSm2_j1</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-06-2023-09-04-Final.mp3',
	// 				'@_length': '67288129',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/111008937056089100',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-06-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-06-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': '38eabd85-f01e-483b-b9bc-ca2f64e51221',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 06',
	// 			pubDate: 'Mon, 04 Sep 2023 21:02:19 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 06 for September 4th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://podcastindex.org/podcast/6459959">Rusty Gate - Girl Like Me</a><br /><a href="https://podcastindex.org/podcast/6560804">Sir Brian with an I - Rockstar</a><br /><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - I Wanna Dance</a><br /><a href="https://www.wavlake.com/album/a047ea02-7c6b-4180-939d-6207ab17b9aa">Jimmy V - Fool me</a><br /><a href="https://www.wavlake.com/album/abf00d67-a2f5-4a0f-bd5b-c24da86fe043">Deez Laughs aka wrapthenews - Waves (freestyle)</a><br /><a href="https://www.wavlake.com/album/d7f3854c-a14e-447f-92ea-aa618184721a">DEVOTEE - Such A Dreamer</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://www.wavlake.com/album/a1338123-6c89-4c1e-9b69-85e9a61ff8d2">Geoff Smith - Gravity</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Figured You Out</a><br /><a href="https://www.wavlake.com/album/ad487bb8-190c-42b6-b942-b78743085e3c">Tis Tis - Another</a><br /><a href="https://podcastindex.org/podcast/6571305">The Death of Rock and Roll - Pulling Rank</a><br /><a href="https://www.wavlake.com/album/cbcbb39b-003d-46d1-8286-d3af3bd7a37a">Jon Ross - Work Sucks</a><br /><a href="https://www.wavlake.com/album/fd268912-4018-4088-a502-fa3e1aec10c6">Silver Unit - Realtime</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a><br /><a href="https://www.wavlake.com/album/7305e2eb-fe96-46c4-b945-b07dfb8439fd">Ryan Fonda - Bright Lights</a><br /><a href="https://www.wavlake.com/album/ff1244f7-5532-47a8-b903-fadab4d4ad77">Amber Sweeney - Breathe</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podverse.fm/episode/ovlSm2_j1">https://podverse.fm/episode/ovlSm2_j1</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 4201,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-06/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '483dde8e-7e94-59a7-8eb0-2b0dc64a87bd',
	// 							'@_itemGuid': '8501fb64-a6a3-475a-8b10-9c746f0fe579'
	// 						},
	// 						'@_startTime': '11.151',
	// 						'@_duration': '180.793',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'bac17f09-ef21-5218-811b-8e61775c9d67',
	// 							'@_itemGuid': '33a56f6c-f8f5-460a-a09b-6449343c22a8'
	// 						},
	// 						'@_startTime': '185.75',
	// 						'@_duration': '199.941',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0d74358-6d3a-5c8a-86e7-9192ca57775e',
	// 							'@_itemGuid': '44287168-ea84-4fbe-8316-f7b18bdc6fba'
	// 						},
	// 						'@_startTime': '383.851',
	// 						'@_duration': '243.749',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'e88e5602-7105-5c7c-8b27-54513aac0ce8',
	// 							'@_itemGuid': 'ccc1470c-ad85-4ae8-bf3a-10d7db63c402'
	// 						},
	// 						'@_startTime': '723.925',
	// 						'@_duration': '251.716',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '0d81f220-12ed-5a91-be9f-b5c65dedcf5c',
	// 							'@_itemGuid': '19331656-c72e-4ac7-8e63-56e34ab0dad5'
	// 						},
	// 						'@_startTime': '971.156',
	// 						'@_duration': '67.291',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '0e18716d-0d4a-5c1c-a6cf-30b7a767656e',
	// 							'@_itemGuid': '0a7e5487-d692-4a83-8a43-bc1eddc7d1d7'
	// 						},
	// 						'@_startTime': '1037.351',
	// 						'@_duration': '190.632',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5ffbb078-b21b-545a-b01e-d3aaa3b3b4c5',
	// 							'@_itemGuid': '92627677-4f5b-4420-85cd-e76b5f9aa7fb'
	// 						},
	// 						'@_startTime': '1390.426',
	// 						'@_duration': '258.247',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0d74358-6d3a-5c8a-86e7-9192ca57775e',
	// 							'@_itemGuid': '43228bfd-8a6a-424a-9532-962119934e48'
	// 						},
	// 						'@_startTime': '1638.351',
	// 						'@_duration': '133.93',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '493d99e6-45cb-5519-b095-ef57b52e6c60',
	// 							'@_itemGuid': '1a7797b8-1ff5-46c8-aea0-f4bb9dde1d6a'
	// 						},
	// 						'@_startTime': '1776.551',
	// 						'@_duration': '217.13',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0301653-1667-5a06-82b6-f4f15b0ed33d',
	// 							'@_itemGuid': 'f9f6e697-726c-48f9-a90a-8cde7899e37d'
	// 						},
	// 						'@_startTime': '2119.125',
	// 						'@_duration': '184.085',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffa34304-9305-5cca-884e-bd5c50008170',
	// 							'@_itemGuid': '82f7e3d9-fb3c-4386-93c9-aaca8aecbe75'
	// 						},
	// 						'@_startTime': '2291.776',
	// 						'@_duration': '203.664',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'c73b1a23-1c28-5edb-94c3-10d1745d0877',
	// 							'@_itemGuid': '7ea7427e-bc7c-4672-96a9-d3cca914434c'
	// 						},
	// 						'@_startTime': '2562.901',
	// 						'@_duration': '183.248',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'bb820c11-1e77-5f96-a3bd-ca1ff4e8510e',
	// 							'@_itemGuid': '77b84175-06a9-401b-b58f-f91e0c38dc75'
	// 						},
	// 						'@_startTime': '2745.001',
	// 						'@_duration': '217.339',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '35dd03d1-f1f2-5622-a673-1b8f13f365e9',
	// 							'@_itemGuid': '917b3a20-2e13-431c-83a8-ba342d7175ce'
	// 						},
	// 						'@_startTime': '2950.15',
	// 						'@_duration': '118.831',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '712c5393-aa44-5c3f-9db6-2a09b2c2fb07',
	// 							'@_itemGuid': '8595ef06-ee89-4d06-9abd-abeed3a098b4'
	// 						},
	// 						'@_startTime': '3066.401',
	// 						'@_duration': '354.194',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '0934956d-b598-52fd-834b-039826493937',
	// 							'@_itemGuid': 'c80f69df-4517-4b65-b2b7-a5ecab5a67dd'
	// 						},
	// 						'@_startTime': '3414.1',
	// 						'@_duration': '254.928',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a1853e5d-6791-5b69-888f-5115ca85106c',
	// 							'@_itemGuid': 'e9bf07fd-b150-45ce-9990-beb41596a606'
	// 						},
	// 						'@_startTime': '3797.026',
	// 						'@_duration': '227.448',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '4017.651',
	// 						'@_duration': '170.762',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 05',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 05 for August 28th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a047ea02-7c6b-4180-939d-6207ab17b9aa">Jimmy V - Fool me</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Back Road</a><br /><a href="https://www.wavlake.com/album/b2386ccd-d73b-4c55-91d6-11afff2269ff">Charles Street Sound Company - Money In A Bag</a><br /><a href="https://noagendasocial.com/@Kurtisdrums">Kurtisdrums - Call Me Medley</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a><br /><a href="https://www.wavlake.com/album/2eaca3b6-089f-4083-8805-72ff092bab32">Sara Jade - Lip Service (Mustache Ride)</a><br /><a href="https://www.wavlake.com/album/5ed81a0d-13bd-45a4-958e-859a09d0ecb1">Homeless Moses - Solution Revolution</a><br /><a href="https://www.wavlake.com/album/4e3cd92d-d36b-42d5-8333-824901160fac">Jessica Lynne Witty - Keep Going</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a><br /><a href="https://www.wavlake.com/album/ed62081d-be3f-4eb5-a9c0-3a92a1d2bd28">The Usual Cats Project - The Odds</a><br /><a href="https://www.wavlake.com/album/10b82d0f-f893-49c1-b1e2-55e97fe32465">Longy - Salt your wounds</a><br /><a href="https://www.wavlake.com/album/c7235b63-ffdf-4167-939a-6dffb179381d">Deez Laughs aka wrapthenews - Lying Dog Faced Pony Soldier</a><br /><a href="https://www.wavlake.com/album/997060e3-9dc1-4cd8-b3c1-3ae06d54bb03">IROH - They Ride</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Figured You Out</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podverse.fm/episode/ovlSm2_j1">https://podverse.fm/episode/ovlSm2_j1</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-05-2023-08-28-Final.mp3',
	// 				'@_length': '69578127',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/110969962163546575',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-05-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-05-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'd70a66d6-4f1c-42dc-9833-cc606947c138',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 05',
	// 			pubDate: 'Mon, 28 Aug 2023 23:52:17 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 05 for August 28th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a047ea02-7c6b-4180-939d-6207ab17b9aa">Jimmy V - Fool me</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/d677db67-0310-4813-970e-e65927c689f1">Nate Johnivan - Back Road</a><br /><a href="https://www.wavlake.com/album/b2386ccd-d73b-4c55-91d6-11afff2269ff">Charles Street Sound Company - Money In A Bag</a><br /><a href="https://noagendasocial.com/@Kurtisdrums">Kurtisdrums - Call Me Medley</a><br /><a href="https://www.wavlake.com/album/6a62e2ec-d2bc-4226-9a97-db85b65bd497">Ainsley Costello - Daydreamer</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a><br /><a href="https://www.wavlake.com/album/2eaca3b6-089f-4083-8805-72ff092bab32">Sara Jade - Lip Service (Mustache Ride)</a><br /><a href="https://www.wavlake.com/album/5ed81a0d-13bd-45a4-958e-859a09d0ecb1">Homeless Moses - Solution Revolution</a><br /><a href="https://www.wavlake.com/album/4e3cd92d-d36b-42d5-8333-824901160fac">Jessica Lynne Witty - Keep Going</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a><br /><a href="https://www.wavlake.com/album/ed62081d-be3f-4eb5-a9c0-3a92a1d2bd28">The Usual Cats Project - The Odds</a><br /><a href="https://www.wavlake.com/album/10b82d0f-f893-49c1-b1e2-55e97fe32465">Longy - Salt your wounds</a><br /><a href="https://www.wavlake.com/album/c7235b63-ffdf-4167-939a-6dffb179381d">Deez Laughs aka wrapthenews - Lying Dog Faced Pony Soldier</a><br /><a href="https://www.wavlake.com/album/997060e3-9dc1-4cd8-b3c1-3ae06d54bb03">IROH - They Ride</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Figured You Out</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a></p>\n<p>Other Music Podcasts:</p>\n<p><a href="https://podcastindex.social/@Meremortals/110936900795092897">https://podcastindex.social/@Meremortals/110936900795092897</a></p>\n<p><a href="https://podcastindex.social/@adam">@adam</a> has "Boostagram Ball"<br /><a href="https://www.boostagramball.com/">https://www.boostagramball.com/</a></p>\n<p><a href="https://podcastindex.social/@james@bne.social">@james</a> has "James\'s Random Music Show Thing"<br /><a href="https://podfans.fm/shows/jamess-random-music-show-thing">https://podfans.fm/shows/jamess-random-music-show-thing</a></p>\n<p>Ryley has "Black Cat Music Podcast"<br /><a href="https://curiocaster.com/podcast/pi6582415">https://curiocaster.com/podcast/pi6582415</a></p>\n<p><a href="https://podcastindex.social/@mikeneumann">@mikeneumann</a> has &ldquo;It&rsquo;s a mood&rdquo;&nbsp;<br /><a href="https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1">https://fountain.fm/show/pcdHkHIWgtcE4ksKubo1</a></p>\n<p><a href="https://podcastindex.social/@boobury">@boobury</a> has &ldquo;Before the Schemes&rdquo;&nbsp;<br /><a href="https://podverse.fm/episode/ovlSm2_j1">https://podverse.fm/episode/ovlSm2_j1</a></p>\n<p><a href="https://podcastindex.social/@silas">@silas</a> has &ldquo;The Fairly Fun Show&rdquo;&nbsp;<br /><a href="https://podcastindex.org/podcast/6567390">https://podcastindex.org/podcast/65673</a></p>\n<p><strong>DJ V4V Podcast</strong><br /><a href="https://podcastindex.org/podcast/6583461">https://podcastindex.org/podcast/6583461</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 4345,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-05/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'e88e5602-7105-5c7c-8b27-54513aac0ce8',
	// 							'@_itemGuid': 'ccc1470c-ad85-4ae8-bf3a-10d7db63c402'
	// 						},
	// 						'@_startTime': '28.251',
	// 						'@_duration': '251.715918',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '259.402',
	// 						'@_duration': '170.762449',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '537df90e-0cc4-535b-84d0-dcb3ca87f1f8',
	// 							'@_itemGuid': '1ea099a5-bb58-493a-ba4f-fa3e47502f60'
	// 						},
	// 						'@_startTime': '541.83',
	// 						'@_duration': '98.35102',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffbd20cd-5132-5c7f-a324-6c4fac956340',
	// 							'@_itemGuid': '9eef5cc8-9ffd-4372-ab74-d0a80d3f9275'
	// 						},
	// 						'@_startTime': '620.201',
	// 						'@_duration': '328.097959',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '69c634ad-afea-5826-ad9a-8e1f06d6470b',
	// 							'@_itemGuid': '2b8cef29-6aa5-4e2f-a726-92f916f2424a'
	// 						},
	// 						'@_startTime': '1013.201',
	// 						'@_duration': '145.32',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5ffbb078-b21b-545a-b01e-d3aaa3b3b4c5',
	// 							'@_itemGuid': '92627677-4f5b-4420-85cd-e76b5f9aa7fb'
	// 						},
	// 						'@_startTime': '1204.601',
	// 						'@_duration': '258.246531',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4ff9d009-df4f-5ac8-9350-220dab1c71b0',
	// 							'@_itemGuid': '243a7aba-9d56-41a6-ae36-ee5bbb5d6089'
	// 						},
	// 						'@_startTime': '1456.111',
	// 						'@_duration': '200.385306',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'faa8ef4b-2c62-58a6-a020-1b15a9dd659b',
	// 							'@_itemGuid': '631fb052-73d6-4e69-91c9-262d392df976'
	// 						},
	// 						'@_startTime': '1799.427',
	// 						'@_duration': '226.037551',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '41669bbc-432a-5f53-aba3-b8a15593350c',
	// 							'@_itemGuid': '1f9915e1-8f51-471d-82b5-9c21140fa0a9'
	// 						},
	// 						'@_startTime': '2040.426',
	// 						'@_duration': '401.057959',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '79720bc8-6cb1-5ab4-a610-7576c78f660d',
	// 							'@_itemGuid': '946f31fa-c2e4-4861-b200-ee40545e32ca'
	// 						},
	// 						'@_startTime': '2425.677',
	// 						'@_duration': '233.874286',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '57203632-2003-55d2-b710-c699db963f18',
	// 							'@_itemGuid': 'b66d8b6c-686d-45e0-804a-1881b9b519ce'
	// 						},
	// 						'@_startTime': '2646.626',
	// 						'@_duration': '227.892245',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '17f28a04-ccb0-5897-84cb-996ba33d883d',
	// 							'@_itemGuid': 'e7645c0e-34df-489a-96d6-1ccc4b513136'
	// 						},
	// 						'@_startTime': '2845.851',
	// 						'@_duration': '370.886531',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6b111f5d-3cc8-5af7-8640-152ca2f5c031',
	// 							'@_itemGuid': 'dac3e9e8-953a-41ff-a764-79522629a715'
	// 						},
	// 						'@_startTime': '3224.077',
	// 						'@_duration': '258.66449',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'a5cb5713-739a-52bf-89f6-ed97f22dbde2',
	// 							'@_itemGuid': 'd154b1be-d819-4358-a5f0-b5477a0c0ca7'
	// 						},
	// 						'@_startTime': '3458.151',
	// 						'@_duration': '75.859592',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ad6bfff9-4d5e-54ef-b5d3-dcc6eaf26e3b',
	// 							'@_itemGuid': 'b2be46be-a757-4bfb-8ecc-3fc89713cd44'
	// 						},
	// 						'@_startTime': '3546.9',
	// 						'@_duration': '201.06449',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd0301653-1667-5a06-82b6-f4f15b0ed33d',
	// 							'@_itemGuid': 'f9f6e697-726c-48f9-a90a-8cde7899e37d'
	// 						},
	// 						'@_startTime': '3840.377',
	// 						'@_duration': '184.084917',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffcb1ad3-a609-52de-bdc8-b8ba5f408f06',
	// 							'@_itemGuid': 'e8b7f53e-6d20-417d-8ede-dafdac6e6b46'
	// 						},
	// 						'@_startTime': '4071.851',
	// 						'@_duration': '280.450612',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 04',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 04 for August 20th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a4fcb9bd-6549-482b-8f85-542281254da0">Richard - Rules Without Rulers</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Don\'t Forget Me</a><br /><a href="https://podcastindex.org/podcast/6579358">Mayday Mayday - Higher- featuring Sir Brian With an I</a><br /><a href="https://chriswenske.com/">Chris Wenske - Coconuts</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/9206fdd8-abb3-4c54-b3ca-ca4fc6552bdd">Epixode - Stubborn Souljah</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a><br /><a href="https://www.wavlake.com/album/5ed81a0d-13bd-45a4-958e-859a09d0ecb1">Homeless Moses - Solution Revolution</a><br /><a href="https://www.wavlake.com/album/e5c8aedd-13a1-449c-aaa8-13cfbfbbac97">Ainsley Costello - Two Ships</a><br /><a href="https://www.wavlake.com/album/75fe0580-e725-4581-8e59-c09052ca39c3">Mr. Information - Adam Bomb</a><br /><a href="https://www.wavlake.com/album/1553e7a7-53f0-4b95-ab25-3950136419fb">Kor Kid Tueng - Someone (ใครสักคนบนฟ้า)</a><br /><a href="https://www.wavlake.com/album/2eaca3b6-089f-4083-8805-72ff092bab32">Sara Jade - Lip Service (Mustache Ride)</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a><br /><a href="https://www.wavlake.com/album/d433fcc5-5760-4bed-a87b-1b202ea283eb">Sista Afia - Shine Your Eye</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-04-2023-08-20-Final.mp3',
	// 				'@_length': '92158581',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/110921626441550308',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-04-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-04-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'fa46d862-590d-48b7-8c66-6b3ca8d4e832',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 04',
	// 			pubDate: 'Sun, 20 Aug 2023 10:51:19 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 04 for August 20th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>LNBeats.com</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/a4fcb9bd-6549-482b-8f85-542281254da0">Richard - Rules Without Rulers</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Don\'t Forget Me</a><br /><a href="https://podcastindex.org/podcast/6579358">Mayday Mayday - Higher- featuring Sir Brian With an I</a><br /><a href="https://chriswenske.com/">Chris Wenske - Coconuts</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.wavlake.com/album/9206fdd8-abb3-4c54-b3ca-ca4fc6552bdd">Epixode - Stubborn Souljah</a><br /><a href="https://www.wavlake.com/album/61e6ee2b-789e-4158-9ccc-cf35c6ac8e48">Amber Sweeney - Be Well</a><br /><a href="https://www.wavlake.com/album/5ed81a0d-13bd-45a4-958e-859a09d0ecb1">Homeless Moses - Solution Revolution</a><br /><a href="https://www.wavlake.com/album/e5c8aedd-13a1-449c-aaa8-13cfbfbbac97">Ainsley Costello - Two Ships</a><br /><a href="https://www.wavlake.com/album/75fe0580-e725-4581-8e59-c09052ca39c3">Mr. Information - Adam Bomb</a><br /><a href="https://www.wavlake.com/album/1553e7a7-53f0-4b95-ab25-3950136419fb">Kor Kid Tueng - Someone (ใครสักคนบนฟ้า)</a><br /><a href="https://www.wavlake.com/album/2eaca3b6-089f-4083-8805-72ff092bab32">Sara Jade - Lip Service (Mustache Ride)</a><br /><a href="https://www.wavlake.com/album/c6ea2ec3-c047-40d1-9978-2261f4ac5e81">Stephen Salvatore - Eleanor</a><br /><a href="https://www.wavlake.com/album/d433fcc5-5760-4bed-a87b-1b202ea283eb">Sista Afia - Shine Your Eye</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3837,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-04/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '7891de21-7e3f-5d3c-b0d3-fcafd4537777',
	// 							'@_itemGuid': '693daffc-3b45-44ab-a5f2-6c2246d1c8c8'
	// 						},
	// 						'@_startTime': '11',
	// 						'@_duration': '96.026',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '514d7a21-041e-5e5f-b7d6-71aa7c7584db',
	// 							'@_itemGuid': 'fcd4be7d-4cff-471c-945f-ee07d7fbcd59'
	// 						},
	// 						'@_startTime': '102',
	// 						'@_duration': '257.04',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b12040fe-8aa9-575a-b952-205977d237d7',
	// 							'@_itemGuid': 'c1c02ad4-0372-4247-8cde-c7ad7d388237'
	// 						},
	// 						'@_startTime': '488',
	// 						'@_duration': '183.536',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd50e670d-282f-5892-a360-ff407f5da2a2',
	// 							'@_itemGuid': 'a196d8b9-fee3-4e9b-9511-5b5ac48654d8'
	// 						},
	// 						'@_startTime': '748',
	// 						'@_duration': '175.183',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '917',
	// 						'@_duration': '170.762',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'c3a62979-11b8-554b-ba61-d8d789b92530',
	// 							'@_itemGuid': '2f4b97dc-45e3-4cee-811b-66ffa2cd3780'
	// 						},
	// 						'@_startTime': '1085',
	// 						'@_duration': '199.758',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffcb1ad3-a609-52de-bdc8-b8ba5f408f06',
	// 							'@_itemGuid': 'e8b7f53e-6d20-417d-8ede-dafdac6e6b46'
	// 						},
	// 						'@_startTime': '1380',
	// 						'@_duration': '280.451',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '41669bbc-432a-5f53-aba3-b8a15593350c',
	// 							'@_itemGuid': '1f9915e1-8f51-471d-82b5-9c21140fa0a9'
	// 						},
	// 						'@_startTime': '1659',
	// 						'@_duration': '401.058',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'c59cad2b-1733-5806-83ad-3c53bbda4630',
	// 							'@_itemGuid': '04cead49-6aab-46ca-af7e-01c51c3bddbf'
	// 						},
	// 						'@_startTime': '2048',
	// 						'@_duration': '217.104',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'dbde9a0c-9279-5ba4-b729-e56e9ed261dd',
	// 							'@_itemGuid': '860dad27-1490-48e2-9a50-a930ff0e5119'
	// 						},
	// 						'@_startTime': '2265',
	// 						'@_duration': '106.58',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '37c9e950-4933-545a-adac-c8c271e4b263',
	// 							'@_itemGuid': '980baf40-d172-4556-96a8-de144116874b'
	// 						},
	// 						'@_startTime': '2370',
	// 						'@_duration': '306.936',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'faa8ef4b-2c62-58a6-a020-1b15a9dd659b',
	// 							'@_itemGuid': '631fb052-73d6-4e69-91c9-262d392df976'
	// 						},
	// 						'@_startTime': '2622',
	// 						'@_duration': '226.038',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '712c5393-aa44-5c3f-9db6-2a09b2c2fb07',
	// 							'@_itemGuid': '8595ef06-ee89-4d06-9abd-abeed3a098b4'
	// 						},
	// 						'@_startTime': '2960',
	// 						'@_duration': '354.194',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd543f513-e2c5-51bd-8d58-5f70303bc1da',
	// 							'@_itemGuid': '05d72368-3407-45dc-bdb5-9e21eb94cbee'
	// 						},
	// 						'@_startTime': '3360',
	// 						'@_duration': '143.595',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4ff9d009-df4f-5ac8-9350-220dab1c71b0',
	// 							'@_itemGuid': '243a7aba-9d56-41a6-ae36-ee5bbb5d6089'
	// 						},
	// 						'@_startTime': '3620',
	// 						'@_duration': '200.385',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 03',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 03 for August 11th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Boostagram Ball</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Nicky and the Shouts - It\'s time</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Matt Bigelow - Fudge!</a><br /><a href="https://soundcloud.com/a-cold-trip-nowhere">Track - Sheets - Title - click to edit</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">PlebRap - Money Printer Go - Too Bit to Fail</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Ainsley Costello - Two Ships</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Kurtisdrums - Call Me Medley</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Bass - Timmy Still Down</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Riot in Progress - Heads Up</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Tis Tis - Another</a><br /><a href="https://www.youtube.com/@BJHuffman/videos">Track - Inside Out</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-03-2023-08-11-Final.mp3',
	// 				'@_length': '37928168',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/110871412929497548',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-03-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-03-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': '0ddf1808-ffe8-40ae-abe7-8fc24f423cc0',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 03',
	// 			pubDate: 'Fri, 11 Aug 2023 14:13:20 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 03 for August 11th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Boostagram Ball</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Nicky and the Shouts - It\'s time</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Matt Bigelow - Fudge!</a><br /><a href="https://soundcloud.com/a-cold-trip-nowhere">Track - Sheets - Title - click to edit</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">PlebRap - Money Printer Go - Too Bit to Fail</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Ainsley Costello - Two Ships</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Kurtisdrums - Call Me Medley</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Bass - Timmy Still Down</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Riot in Progress - Heads Up</a><br /><a href="https://www.thesplitkit.com/events/dashboard/0eb674ad-d5d8-48b9-ab70-5bd11a4ec6e0">Tis Tis - Another</a><br /><a href="https://www.youtube.com/@BJHuffman/videos">Track - Inside Out</a></p>\n<p>Onboard your favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 2366,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-03/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'cb656d86-ec4d-5a7f-b97c-22e7599c4e44',
	// 							'@_itemGuid': '540a13f2-e7d3-47ef-b99d-631274cf2c23'
	// 						},
	// 						'@_startTime': '11.051',
	// 						'@_duration': '134.592',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b40ffcf7-2c48-5cfe-8daa-b65d766b2c25',
	// 							'@_itemGuid': '9a48aab8-6da6-4cc1-9951-5b049c333580'
	// 						},
	// 						'@_startTime': '141.302',
	// 						'@_duration': '214.204082',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:valueRecipient': {
	// 							'@_name': 'A Cold Trip Nowhere',
	// 							'@_split': '100',
	// 							'@_type': 'node',
	// 							'@_address': '038399372001f2741d58d6ec4846fccb78daa1a485e69e2eebc5aadba047d35956',
	// 							'@_customValue': '',
	// 							'@_customKey': ''
	// 						},
	// 						'@_startTime': '475.676',
	// 						'@_duration': '164',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '47081700-bd65-511f-b535-f545f3cd660c',
	// 							'@_itemGuid': '7b03666e-b323-499d-93a7-ca51ce627ffd'
	// 						},
	// 						'@_startTime': '639.601',
	// 						'@_duration': '152.581224',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'c59cad2b-1733-5806-83ad-3c53bbda4630',
	// 							'@_itemGuid': '04cead49-6aab-46ca-af7e-01c51c3bddbf'
	// 						},
	// 						'@_startTime': '783.55',
	// 						'@_duration': '217.103673',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '69c634ad-afea-5826-ad9a-8e1f06d6470b',
	// 							'@_itemGuid': '2b8cef29-6aa5-4e2f-a726-92f916f2424a'
	// 						},
	// 						'@_startTime': '1111.8',
	// 						'@_duration': '145.32',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '1254.201',
	// 						'@_duration': '170.762449',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '5d0fb141-8999-55cb-88bb-715ae358a33f',
	// 							'@_itemGuid': '1beecbb0-363f-446b-afff-05cde91d3e7e'
	// 						},
	// 						'@_startTime': '1502.451',
	// 						'@_duration': '102.086531',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'fc157bb7-6fbd-5ab1-8de2-7c5e7b6ab16e',
	// 							'@_itemGuid': 'de4d157c-3c56-484a-887a-6e30e96185c5'
	// 						},
	// 						'@_startTime': '1597.9',
	// 						'@_duration': '240.770612',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'ffa34304-9305-5cca-884e-bd5c50008170',
	// 							'@_itemGuid': '82f7e3d9-fb3c-4386-93c9-aaca8aecbe75'
	// 						},
	// 						'@_startTime': '1838.051',
	// 						'@_duration': '203.664',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:valueRecipient': {
	// 							'@_name': 'BJ Huffman',
	// 							'@_split': '100',
	// 							'@_type': 'node',
	// 							'@_address': '038399372001f2741d58d6ec4846fccb78daa1a485e69e2eebc5aadba047d35956',
	// 							'@_customValue': '',
	// 							'@_customKey': ''
	// 						},
	// 						'@_startTime': '2172.6',
	// 						'@_duration': '183',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 02',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 02 for August 5th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/8185da89-01a5-462e-b74f-7867d8ddc6fe">Signs and Signals - Modern Marie</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a><br /><a href="https://www.wavlake.com/album/e5c8aedd-13a1-449c-aaa8-13cfbfbbac97">Ainsley Costello - Two Ships</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Don\'t Forget Me</a><br /><a href="https://podcastindex.org/podcast/6560804">Sir Brian with an I - Rockstar</a><br /><a href="https://ableandthewolf.com/">Able and The Wolf - Makin\' Beans</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.wavlake.com/album/9fa13fce-8544-43e7-8289-a4706c6f8ed9">Chris Wenske - Cheaters Never Win - Chris Wenske w/ Top Tipton</a><br /><a href="https://www.wavlake.com/album/09298530-2134-45b0-898f-08f63348bc57">Jeremy Oliveria - Looking For You (Feat. Kellin Quinn)</a><br /><a href="https://www.wavlake.com/album/d0efe4fb-714e-4ea1-a6b4-422842262cf2">Ainsley Costello - Cherry On Top</a></p>\n<p>Onboard you favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-02-2023-08-05-Final.mp3',
	// 				'@_length': '56458388',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://noagendasocial.com/@adam/110838801460236772',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-02-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-02-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': '4dfca1a2-7a30-45b9-a214-40b6abae7659',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 02',
	// 			pubDate: 'Sat, 05 Aug 2023 19:50:42 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 02 for August 5th 2023</strong></p>\n<p>Boostagram Ball is a music podcast where we automatically switch to the artists\' wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://www.wavlake.com/album/8185da89-01a5-462e-b74f-7867d8ddc6fe">Signs and Signals - Modern Marie</a><br /><a href="https://www.wavlake.com/album/6bece1b8-5385-4a33-9224-09e7f3ee6965">Ryan Fonda - Cast Away</a><br /><a href="https://www.wavlake.com/album/e5c8aedd-13a1-449c-aaa8-13cfbfbbac97">Ainsley Costello - Two Ships</a><br /><a href="https://www.wavlake.com/album/ec8ce316-9461-48e1-8fd2-17d46f5ebe3d">Sam Means - Calina</a><br /><a href="https://www.wavlake.com/album/62a7db26-d2cc-4d69-8e7a-7d476eefc690">Bobby Shell - Sugar Baby (Single)</a><br /><a href="https://www.sirtjthewrathful.com/">The Doerfels - Don\'t Forget Me</a><br /><a href="https://podcastindex.org/podcast/6560804">Sir Brian with an I - Rockstar</a><br /><a href="https://ableandthewolf.com/">Able and The Wolf - Makin\' Beans</a><br /><a href="https://podcastindex.org/podcast/6473218">The Doerfels - Bloodshot Lies</a><br /><a href="https://www.wavlake.com/album/ac6af3f6-b9d8-4489-a066-720cda201cf1">Corey Keller - It\'s So Hard to Feel Alive</a><br /><a href="https://www.wavlake.com/album/9fa13fce-8544-43e7-8289-a4706c6f8ed9">Chris Wenske - Cheaters Never Win - Chris Wenske w/ Top Tipton</a><br /><a href="https://www.wavlake.com/album/09298530-2134-45b0-898f-08f63348bc57">Jeremy Oliveria - Looking For You (Feat. Kellin Quinn)</a><br /><a href="https://www.wavlake.com/album/d0efe4fb-714e-4ea1-a6b4-422842262cf2">Ainsley Costello - Cherry On Top</a></p>\n<p>Onboard you favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3525,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-02/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '99'
	// 					},
	// 					{
	// 						'@_name': 'Fountain Boost Bot',
	// 						'@_type': 'node',
	// 						'@_address': '0332d57355d673e217238ce3e4be8491aa6b2a13f95494133ee243e57df1653ace',
	// 						'@_customKey': '112111100',
	// 						'@_customValue': 'wal_GJWRnH1vp88Uf',
	// 						'@_split': '1'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '65af69db-7dcf-5c95-bf27-7526a6dbce35',
	// 							'@_itemGuid': '1527f553-4ce7-437a-b9ef-dcfcf925d8ba'
	// 						},
	// 						'@_startTime': '11.126',
	// 						'@_duration': '173.584',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '57203632-2003-55d2-b710-c699db963f18',
	// 							'@_itemGuid': 'b66d8b6c-686d-45e0-804a-1881b9b519ce'
	// 						},
	// 						'@_startTime': '185.325',
	// 						'@_duration': '227.892',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'c59cad2b-1733-5806-83ad-3c53bbda4630',
	// 							'@_itemGuid': '04cead49-6aab-46ca-af7e-01c51c3bddbf'
	// 						},
	// 						'@_startTime': '604.251',
	// 						'@_duration': '217.104',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '4ff9d009-df4f-5ac8-9350-220dab1c71b0',
	// 							'@_itemGuid': '243a7aba-9d56-41a6-ae36-ee5bbb5d6089'
	// 						},
	// 						'@_startTime': '815.977',
	// 						'@_duration': '200.385',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '6e1b0838-4eff-5dd9-aa16-7b2481d077f9',
	// 							'@_itemGuid': 'c0aaeff8-5a26-49cf-8dad-2b6909e4aed1'
	// 						},
	// 						'@_startTime': '1104.826',
	// 						'@_duration': '170.762',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '514d7a21-041e-5e5f-b7d6-71aa7c7584db',
	// 							'@_itemGuid': 'fcd4be7d-4cff-471c-945f-ee07d7fbcd59'
	// 						},
	// 						'@_startTime': '1353.002',
	// 						'@_duration': '257.04',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'bac17f09-ef21-5218-811b-8e61775c9d67',
	// 							'@_itemGuid': '33a56f6c-f8f5-460a-a09b-6449343c22a8'
	// 						},
	// 						'@_startTime': '1707.401',
	// 						'@_duration': '199.941',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'd46367eb-be3c-548a-9c27-fbf1dcf27f30',
	// 							'@_itemGuid': 'c7003607-233e-40e8-b2fa-6465127d0076'
	// 						},
	// 						'@_startTime': '1969.625',
	// 						'@_duration': '187.376',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8b6971e-403e-568f-a4e6-7aa2b45e50d4',
	// 							'@_itemGuid': '72a3b402-8491-4cd9-823e-a621fd81b86f'
	// 						},
	// 						'@_startTime': '2222.125',
	// 						'@_duration': '216.059',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '493d99e6-45cb-5519-b095-ef57b52e6c60',
	// 							'@_itemGuid': '1a7797b8-1ff5-46c8-aea0-f4bb9dde1d6a'
	// 						},
	// 						'@_startTime': '2523.45',
	// 						'@_duration': '217.13',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '42dda917-0cd7-5bea-ab56-8dccb8efd87e',
	// 							'@_itemGuid': 'b6210a1f-6f87-4ed1-8d93-e084fe702413'
	// 						},
	// 						'@_startTime': '2807.351',
	// 						'@_duration': '212.088',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '94661b95-cae4-5f47-a599-ed27d530dfa2',
	// 							'@_itemGuid': 'ba1796d0-5c80-4ccf-9c75-24c87c6dbad4'
	// 						},
	// 						'@_startTime': '3013.828',
	// 						'@_duration': '252.48',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b55c93d2-4571-55fd-9562-7966beaa7ea2',
	// 							'@_itemGuid': '729ff127-1fcc-4086-8e67-4386e87ac585'
	// 						},
	// 						'@_startTime': '3335.8',
	// 						'@_duration': '183.216',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Boostagram Ball - Episode 01',
	// 			description:
	// 				'<p><strong>Boostagram Ball Episode 01 for July 28th 2023</strong></p>\n<p>It\'s the first every Boostagram Ball where we automatically switch to the artists wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://podcastindex.org/podcast/6473218">The Doerfuls</a><br /><a href="https://podcastindex.org/podcast/6420987">Longy</a><br /><a href="https://podcastindex.org/podcast/6471422">Ainsley Costello</a><br /><a href="https://podcastindex.org/podcast/6506965">Jeremey Oliveria</a><br /><a href="https://podcastindex.org/podcast/6459315">Sara Jade</a><br /><a href="https://podcastindex.org/podcast/6422146">DETOX Music</a><br /><a href="https://podcastindex.org/podcast/6442935">Ali Mitchell</a><br /><a href="https://podcastindex.org/podcast/6420979">Lay\'z</a><br /><a href="https://podcastindex.org/podcast/5817582">Joe Martin</a><br /><a href="https://podcastindex.org/podcast/6364475">Corey Keller</a></p>\n<p>Onboard you favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/BBALL-01-2023-07-28-Final.mp3',
	// 				'@_length': '0',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:socialInteract': {
	// 				'@_uri': 'https://podcastindex.social/@adam/110792645230496241',
	// 				'@_protocol': 'activitypub',
	// 				'@_accountId': '@adam',
	// 				'@_accountUrl': 'https://podcastindex.social/users/adam'
	// 			},
	// 			'podcast:transcript': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-01-Transcript.srt',
	// 				'@_type': 'application/srt'
	// 			},
	// 			'podcast:chapters': {
	// 				'@_url': 'https://mp3s.nashownotes.com/BBALL-01-Chapters.json',
	// 				'@_type': 'application/json'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'c84dd6a1-7b0d-4076-91b3-7842bc030130',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Boostagram Ball - Episode 01',
	// 			pubDate: 'Fri, 28 Jul 2023 18:56:05 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary':
	// 				'<p><strong>Boostagram Ball Episode 01 for July 28th 2023</strong></p>\n<p>It\'s the first every Boostagram Ball where we automatically switch to the artists wallet when playing their songs</p>\n<p>Use a modern podcast app from <a href="https://podcastapps.com">podcastapps.com</a> to support the show and the music:</p>\n<ul>\n<li>Fountain</li>\n<li>Podverse</li>\n<li>Podfans</li>\n<li>Curiocaster</li>\n<li>Podfriend</li>\n<li>Podcast Guru</li>\n<li>Podcast Addict</li>\n<li>More added daily!</li>\n</ul>\n<p>Music on Today\'s Show:</p>\n<p><a href="https://podcastindex.org/podcast/6473218">The Doerfuls</a><br /><a href="https://podcastindex.org/podcast/6420987">Longy</a><br /><a href="https://podcastindex.org/podcast/6471422">Ainsley Costello</a><br /><a href="https://podcastindex.org/podcast/6506965">Jeremey Oliveria</a><br /><a href="https://podcastindex.org/podcast/6459315">Sara Jade</a><br /><a href="https://podcastindex.org/podcast/6422146">DETOX Music</a><br /><a href="https://podcastindex.org/podcast/6442935">Ali Mitchell</a><br /><a href="https://podcastindex.org/podcast/6420979">Lay\'z</a><br /><a href="https://podcastindex.org/podcast/5817582">Joe Martin</a><br /><a href="https://podcastindex.org/podcast/6364475">Corey Keller</a></p>\n<p>Onboard you favorite artists, send them to:</p>\n<ul>\n<li><a href="https://Wavlake.com">Wavlake.com</a></li>\n<li><a href="https://Podcastindex.org">Podcastindex.org</a></li>\n<li><a href="https://MusicSideProject.com">MusicSideProject.com</a></li>\n<li><a href="https://Conshax.app">Conshax.app</a></li>\n<li><a href="https://Fountain.fm">Fountain.fm</a></li>\n</ul>\n<p>More info on the show: <a href="https://BoostagramBall.com">BoostagramBall.com</a></p>\n<p>&nbsp;</p>',
	// 			'itunes:duration': 3771,
	// 			link: 'https://www.boostagramball.com/boostagram-ball-episode-01/',
	// 			'podcast:value': {
	// 				'podcast:valueRecipient': [
	// 					{
	// 						'@_name': 'Sovereign Feeds',
	// 						'@_address': '030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3',
	// 						'@_type': 'node',
	// 						'@_customKey': '696969',
	// 						'@_customValue': 'eChoVKtO1KujpAA5HCoB',
	// 						'@_fee': 'true',
	// 						'@_split': '5'
	// 					},
	// 					{
	// 						'@_name': 'IPFSPodcating.net',
	// 						'@_type': 'node',
	// 						'@_address': '028eb5be336f7fdf2a4e40c57ff55d3d5d71277bb4197ea14957f756bff249e623',
	// 						'@_split': '5',
	// 						'@_fee': 'true'
	// 					},
	// 					{
	// 						'@_name': 'Boostagram Ball',
	// 						'@_type': 'node',
	// 						'@_address': '021f548a8ab5eb8e7cf91e4c9777c388463e213485ece9a1808e3c6850084ee630',
	// 						'@_split': '100'
	// 					}
	// 				],
	// 				'podcast:valueTimeSplit': [
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8b6971e-403e-568f-a4e6-7aa2b45e50d4',
	// 							'@_itemGuid': '72a3b402-8491-4cd9-823e-a621fd81b86f'
	// 						},
	// 						'@_startTime': '11',
	// 						'@_duration': '216.059',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b8619983-c00a-5161-9fe6-6028530e1bda',
	// 							'@_itemGuid': '0492519b-e55d-47d3-9935-09ad490878c1'
	// 						},
	// 						'@_startTime': '321.675',
	// 						'@_duration': '191.79102',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'b55c93d2-4571-55fd-9562-7966beaa7ea2',
	// 							'@_itemGuid': '729ff127-1fcc-4086-8e67-4386e87ac585'
	// 						},
	// 						'@_startTime': '723.601',
	// 						'@_duration': '183.216',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '94661b95-cae4-5f47-a599-ed27d530dfa2',
	// 							'@_itemGuid': 'ba1796d0-5c80-4ccf-9c75-24c87c6dbad4'
	// 						},
	// 						'@_startTime': '901.502',
	// 						'@_duration': '252.48',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '45874e17-fdfb-5693-a817-5e584da20e5b',
	// 							'@_itemGuid': 'e646b30a-2007-4086-b35b-58570c33c159'
	// 						},
	// 						'@_startTime': '1430.602',
	// 						'@_duration': '156.336',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '18e9e127-196b-5775-9662-5f6dee6b7a94',
	// 							'@_itemGuid': 'c6cb7c68-9997-4ee5-aaf6-34186395cbb6'
	// 						},
	// 						'@_startTime': '1734.576',
	// 						'@_duration': '220.05551',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '10129e9e-ffc0-5c74-9132-b194f2a593a3',
	// 							'@_itemGuid': '87c0d2f9-909f-48ce-8b02-3986aa9b0013'
	// 						},
	// 						'@_startTime': '2117.801',
	// 						'@_duration': '243.487347',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': 'cb7e7b12-7267-560f-88ae-9f467b44125d',
	// 							'@_itemGuid': '3281988d-df55-4bd3-95f9-dfcea4456f42'
	// 						},
	// 						'@_startTime': '2758.801',
	// 						'@_duration': '190.51102',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '78ae7a58-679a-50dd-95c0-c8f69e431b78',
	// 							'@_itemGuid': 'e1c2e15d-656c-41de-a52c-6771292a7312'
	// 						},
	// 						'@_startTime': '3098',
	// 						'@_duration': '230.352',
	// 						'@_remotePercentage': '90'
	// 					},
	// 					{
	// 						'podcast:remoteItem': {
	// 							'@_feedGuid': '493d99e6-45cb-5519-b095-ef57b52e6c60',
	// 							'@_itemGuid': '1a7797b8-1ff5-46c8-aea0-f4bb9dde1d6a'
	// 						},
	// 						'@_startTime': '3554',
	// 						'@_duration': '217.13',
	// 						'@_remotePercentage': '90'
	// 					}
	// 				],
	// 				'@_type': 'lightning',
	// 				'@_method': 'keysend',
	// 				'@_suggested': '0.00000005000'
	// 			}
	// 		},
	// 		{
	// 			title: 'Just The Opener',
	// 			description: '<p>Boostagram Ball Dummy Episiode</p>\n<p>Just the opener!</p>',
	// 			'itunes:image': {
	// 				'@_href': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png'
	// 			},
	// 			enclosure: {
	// 				'@_url':
	// 					'https://op3.dev/e/ipfspodcasting.net/e/mp3s.nashownotes.com/boostagramballopener.mp3',
	// 				'@_length': '239512',
	// 				'@_type': 'audio/mpeg'
	// 			},
	// 			'podcast:person': {
	// 				'#text': 'Adam Curry',
	// 				'@_href': 'https://boostagramball.com/',
	// 				'@_img':
	// 					'https://cdn.masto.host/podcastindexsocial/accounts/avatars/000/000/001/original/432eaf9ef000c39a.jpeg',
	// 				'@_group': 'cast',
	// 				'@_role': 'host'
	// 			},
	// 			'podcast:images': {
	// 				'@_srcset': 'https://noagendaassets.com/enc/1690556352.157_bball-show-art-black.png 1080w'
	// 			},
	// 			guid: {
	// 				'#text': 'BB-01',
	// 				'@_isPermaLink': 'false'
	// 			},
	// 			'itunes:subtitle': 'Just The Opener',
	// 			pubDate: 'Sat, 22 Jul 2023 22:16:33 +0000',
	// 			'itunes:explicit': 'No',
	// 			author: 'Adam Curry',
	// 			'itunes:author': 'Adam Curry',
	// 			'itunes:keywords': 'boostagram ball music value4value',
	// 			'itunes:summary': '<p>Boostagram Ball Dummy Episiode</p>\n<p>Just the opener!</p>',
	// 			'itunes:duration': 14,
	// 			link: 'https://www.boostagramball.com/just-the-opener/'
	// 		}
	// 	],
	// 	'itunes:explicit': 'no'
	// };

	// item = {
	// 	title: 't1',
	// 	'itunes:image': {
	// 		'@_href': ''
	// 	},
	// 	description: '',
	// 	guid: {
	// 		'#text': '',
	// 		'@_isPermaLink': 'false'
	// 	},
	// 	'podcast:transcript': {
	// 		'@_url': '',
	// 		'@_type': 'application/x-subrip'
	// 	},
	// 	'podcast:chapters': {
	// 		'@_url': '',
	// 		'@_type': 'application/json'
	// 	},
	// 	enclosure: {
	// 		'@_url': 'https://ableandthewolf.com/static/media/music/01_MakinBeans.mp3',
	// 		'@_length': 7573869,
	// 		'@_type': 'audio/mpeg'
	// 	},
	// 	'podcast:value': {
	// 		'podcast:valueRecipient': [
	// 			{
	// 				'@_name': '',
	// 				'@_address': '',
	// 				'@_type': 'node',
	// 				'@_customKey': '',
	// 				'@_customValue': '',
	// 				'@_split': ''
	// 			}
	// 		],
	// 		'@_type': 'lightning',
	// 		'@_method': 'keysend',
	// 		'@_suggested': '0.00000005000'
	// 	},
	// 	'itunes:explicit': 'no',
	// 	duration: '03:07'
	// };

	console.log(item);
	onDestroy(() => {
		$feedShowNotes = '';
	});
</script>

<svelte:component this={screens[screenIndex]} bind:screenIndex bind:feed bind:item />
