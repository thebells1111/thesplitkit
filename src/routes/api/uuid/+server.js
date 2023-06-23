import { text } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function GET({ url, cookies }) {
	let uuid = url.searchParams.get('uuid') ?? '';
	let episode = url.searchParams.get('episode') || '';

	if (episode !== 'undefined') {
		cookies.set('episode', episode, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});
	} else {
		cookies.set('episode', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 0
		});
	}
	cookies.set('uuid', uuid, {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60 * 60 * 24 * 30
	});
	return text(uuid);
}
