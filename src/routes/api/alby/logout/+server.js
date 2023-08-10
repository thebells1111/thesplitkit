import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function GET({ cookies }) {
	cookies.set('awt', 'logged out', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 60
	});
	return json({ loggedIn: false });
}
