<script>
	import { onMount } from 'svelte';
	import { liveBlocks } from '$/stores';
	let notes = '';

	onMount(() => {
		notes = generateHtmlString($liveBlocks);
	});

	function generateHtmlString(data) {
		if (!data) return '';
		let htmlString = '<p>';

		console.log(data);

		data.forEach((item) => {
			// Ignore items that have settings.default as true or no startTime
			console.log(item);
			if ((item.settings && item.settings.default === true) || !item.startTime) return;

			// Format the start time
			let hours = Math.floor(item.startTime / 3600);
			let minutes = Math.floor((item.startTime % 3600) / 60);
			let seconds = Math.floor(item.startTime % 60);
			let formattedTime =
				hours > 0
					? `[${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
							.toString()
							.padStart(2, '0')}]`
					: `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;

			// Create the link text
			let linkText = '';
			if (item.line[1]) {
				linkText = item.line[1];
				if (item.title) {
					linkText += ' - ';
				}
			}

			if (item.title) {
				linkText += item.title;
			}

			if (linkText) {
				htmlString += `<a href="${item.link.url}">${linkText}</a><br />`;
			}
		});

		htmlString += '</p>';
		return htmlString;
	}
</script>

{@html notes}
