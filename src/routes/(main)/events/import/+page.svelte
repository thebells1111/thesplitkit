<script>
	import { XMLParser } from 'fast-xml-parser';
	import { remoteServer } from '$/stores';
	let xmlFile = ''; // Initialize the xmlFile variable to store the XML content
	let warningText = ''; // Initialize the warningText variable
	const options = {
		ignoreAttributes: false
	};
	const parser = new XMLParser(options);

	$: if (xmlFile) {
		fetchVTS(xmlFile);
	}

	async function fetchVTS(xmlFile) {
		let xmlObj = parser.parse(xmlFile);

		let VTS = xmlObj.rss.channel.item[0]['podcast:value']['podcast:valueTimeSplit'];

		let blocks = [];
		for (const v of VTS) {
			const feedGuid = v['podcast:remoteItem']['@_feedGuid'];
			const itemGuid = v['podcast:remoteItem']['@_itemGuid'];
			let ep = await fetchEpisodes(feedGuid, itemGuid);
			console.log(ep);
			if (ep) {
				let block = {
					chaptersUrl: ep.chaptersUrl,
					description: ep.description,
					duration: v['@_duration'] || 0,
					enclosureUrl: ep.enclosureUrl,
					image: ep.artwork || ep.image || ep.feedImage,
					feedGuid,
					itemGuid,
					line: [ep.album, ep.artist],
					link: ep.link,
					type: 'music',
					startTime: v['@startTime'] || 0,
					settings: { split: v['@_remotePercentage'] || 95 },
					title: ep.title
				};
				blocks.push(block);
			}
		}
		console.log(blocks);
		console.log(VTS);
	}

	// Function to handle file upload
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			if (file.name.endsWith('.xml')) {
				const reader = new FileReader();

				reader.onload = (e) => {
					xmlFile = e.target.result; // Store the XML content in the xmlFile variable
					warningText = ''; // Clear the warning text
				};

				reader.readAsText(file);
			} else {
				warningText = 'This file is not an XML file.';
				xmlFile = ''; // Clear xmlFile if the file is not XML
			}
		}
	};

	// Function to handle file drop
	const handleFileDrop = (event) => {
		event.preventDefault();
		const file = event.dataTransfer.files[0];

		if (file) {
			if (file.name.endsWith('.xml')) {
				const reader = new FileReader();

				reader.onload = (e) => {
					xmlFile = e.target.result; // Store the XML content in the xmlFile variable
					warningText = ''; // Clear the warning text
				};

				reader.readAsText(file);
			} else {
				warningText = 'This file is not an XML file.';
				xmlFile = ''; // Clear xmlFile if the file is not XML
			}
		}
	};

	// Prevent default behavior for drag and drop
	const preventDefault = (event) => {
		event.preventDefault();
	};

	async function fetchEpisodes(podcastGuid, itemGuid) {
		try {
			const feedUrl =
				remoteServer +
				`/api/queryindex?q=${encodeURIComponent(`/podcasts/byguid?guid=${podcastGuid}`)}`;
			let episodesUrl = `/api/queryindex?q=${encodeURIComponent(
				`/episodes/bypodcastguid?guid=${guid}&max=1000`
			)}`;

			const [feedRes, episodesRes] = await Promise.all([fetch(feedUrl), fetch(episodesUrl)]);

			if (!feedRes.ok || !episodesRes.ok) {
				throw new Error('Error fetching episodes');
			}

			const feedData = await feedRes.json();
			const episodesData = await episodesRes.json();

			console.log(feedData);
			console.log(episodesData);

			// Find the episode with matching itemGuid
			const matchingEpisode = episodesData.items.find((episode) => episode.guid === itemGuid);

			if (matchingEpisode) {
				matchingEpisode.album = feedData.feed.title;
				matchingEpisode.artist = feedData.feed.author;
				return matchingEpisode;
			} else {
				console.log('No matching episode found for itemGuid:', itemGuid);
			}
		} catch (err) {
			console.error('Error fetching episodes:', err);
		}
	}
</script>

<div on:dragover={preventDefault} on:drop={handleFileDrop}>
	<input type="file" accept=".xml" on:change={handleFileUpload} />
	<p>Drag and drop an XML file here or click to upload.</p>
	{#if warningText}
		<p>{warningText}</p>
	{/if}
</div>

<style>
	div {
		border: 2px dashed #cccccc;
		padding: 20px;
		text-align: center;
		cursor: pointer;
		margin: 8px;
		height: 100%;
		border-radius: 8px;
	}
</style>
