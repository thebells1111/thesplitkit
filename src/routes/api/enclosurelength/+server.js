import { json, error } from '@sveltejs/kit';

export async function GET({ url }) {
	try {
		const q = url.searchParams.get('q');
		console.log(q);
		if (q) {
			const response = await fetch(q, { method: 'HEAD' });
			console.log(response.headers);
			const contentType = response.headers.get('Content-Type');
			console.log(contentType);

			let data = {};

			if (contentType && contentType.startsWith('audio/')) {
				data.url = q;
				data.length = response.headers.get('Content-Length') || '';
				data.type = contentType;
				console.log(data);
				return json({
					url: q,
					length: response.headers.get('Content-Length') || '',
					type: contentType
				});
			} else {
				return json({ error: 'Not an audio file' });
			}
		} else {
			return json({ error: 'Not an audio file' });
		}
	} catch (error) {
		console.log(error);
		throw error(500, { error: 'Server Error' });
	}
}
