import { text } from '@sveltejs/kit';

export async function GET({ url }) {
	const q = url.searchParams.get('q');

	if (!q || !isValidURL(q)) {
		return { status: 400, body: 'Invalid URL provided' };
	}

	const allowedDomains = ['example.com', 'another-example.com'];
	const parsedUrl = new URL(q);
	if (!allowedDomains.includes(parsedUrl.hostname)) {
		return { status: 403, body: 'Fetching from this domain is not allowed' };
	}

	let res;
	try {
		res = await fetch(q, { method: 'HEAD' });
		if (!res.ok) {
			return { status: res.status, body: 'Failed to fetch the URL' };
		}
	} catch (error) {
		return { status: 500, body: 'Server error' };
	}

	const contentType = res.headers.get('Content-Type');
	return text(contentType);
}
