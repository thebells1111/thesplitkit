import { XMLParser } from 'fast-xml-parser';

import { remoteServer } from '$/stores';

async function fetchRSS(url) {
	console.log(url);
	const res = await fetch(remoteServer + '/api/proxy?url=' + encodeURIComponent(url), {
		headers: { 'User-Agent': 'TheSplitKit/0.1' }
	});
	let xml;
	xml = await res.text();
	if (!xml.includes('<rss')) throw new Error('Not XML');

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

	const options = {
		attributeNamePrefix: '@_',
		textNodeName: '#text',
		ignoreAttributes: false,
		allowBooleanAttributes: true
	};

	const parser = new XMLParser(options);
	const xmlObj = parser.parse(xml);
	const channel = xmlObj.rss.channel;

	return channel;
}

export default fetchRSS;
