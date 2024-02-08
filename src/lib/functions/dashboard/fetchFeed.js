import { XMLParser } from 'fast-xml-parser';
import { remoteServer } from '$/stores';

export default async function fetchFeed(url) {
	if (url) {
		const res = await fetch(remoteServer + '/api/proxy?url=' + encodeURIComponent(url), {
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
		return channel;
	}
}
