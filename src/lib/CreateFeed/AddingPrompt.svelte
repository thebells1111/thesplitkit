<script>
	export let screenIndex;
	export let feed;
	export let item;
	import { XMLParser, XMLBuilder } from 'fast-xml-parser';

	import { decode } from 'html-entities';
	import { remoteServer } from '$/stores';
	let showInput = true;
	let indexQuery = 'Boostagram Ball';
	let indexResults = [];

	async function handleSubmit() {
		screenIndex = 1;
	}

	async function searchPodcastIndex() {
		let url =
			remoteServer + `/api/queryindex?q=${encodeURIComponent(`/search/byterm?q=${indexQuery}`)}`;

		const res = await fetch(url);
		let data = await res.json();
		if (data.status === 'true') {
			indexResults = data.feeds;
		}

		console.log(data);
	}

	async function fetchFeed(feedQuery) {
		const res = await fetch(remoteServer + '/api/proxy?url=' + encodeURIComponent(feedQuery.url), {
			headers: { 'User-Agent': 'TheSplitKit/0.1' }
		});
		const xml = await res.text();
		if (!xml.includes('<rss')) throw new Error('Not XML');

		const options = {
			attributeNamePrefix: '@_',
			textNodeName: '#text',
			ignoreAttributes: false,
			allowBooleanAttributes: true
		};

		const parser = new XMLParser(options);
		const xmlObj = parser.parse(xml);
		const channel = xmlObj.rss.channel;
		// Update the generator tag
		channel.generator = feed.generator;

		//normalizeExplicit
		let explicit = channel['itunes:explicit'];
		explicit = explicit?.toString()?.toLowerCase()?.trim();

		if (['true', 'yes'].includes(explicit)) {
			channel['itunes:explicit'] = 'yes';
		} else if (['false', 'no'].includes(explicit)) {
			channel['itunes:explicit'] = 'no';
		} else {
			channel['itunes:explicit'] = 'no';
		}

		// Insert missing keys
		for (const [key, value] of Object.entries(feed)) {
			if (!channel.hasOwnProperty(key)) {
				channel[key] = value;
			}
		}
		feed = channel;
		console.log(feed);
		screenIndex = 1;

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

		// const builder = new XMLBuilder(buildOptions);
		// let newXml = builder.build(feed);
		// console.log(newXml);
	}

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
</script>

<h3>Are you adding this event to an existing feed?</h3>
{#if showInput}
	<label>
		<p>Find feed</p>
		<input bind:value={indexQuery} />
	</label>
	<button on:click={searchPodcastIndex}>Get Feed</button>
	<ul>
		{#each indexResults as feed}
			<li class="pi-result" on:click={fetchFeed.bind(this, feed)}>
				<img src={feed?.artwork || feed?.image} alt={feed?.title} width="40" height="40" />
				{feed?.title}
			</li>
		{/each}
	</ul>
{:else}
	<button-row>
		<button
			on:click={() => {
				showInput = true;
			}}>Yes</button
		>
		<button
			on:click={() => {
				screenIndex = 1;
			}}>No</button
		>
	</button-row>
{/if}

<style>
	ul {
		padding: 0;
		flex: 1;
		overflow: auto;
		margin: 0 8px;
		width: calc(100%);
	}

	li {
		list-style: none;
		padding: 0;
		width: calc(100% - 28px);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 8px 4px 4px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		margin: 4px 8px;
	}

	img {
		border: 1px solid gray;
		margin-right: 0.5em;
	}
</style>
