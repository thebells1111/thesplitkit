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

			// Create the link text
			let linkText = '';
			if (item.line[1] && item.line[1] !== 'Text - click to edit') {
				linkText = item.line[1];
				if (item.title && item.title !== 'Text - click to edit') {
					linkText += ' - ';
				}
			}

			if (item.title && item.title !== 'Title - click to edit') {
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
