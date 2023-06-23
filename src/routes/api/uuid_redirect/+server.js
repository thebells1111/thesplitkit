import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function GET({ url, cookies }) {
	let uuid = cookies.get('uuid');
	let episode = cookies.get('episode');
	return json({ uuid, episode });
}
