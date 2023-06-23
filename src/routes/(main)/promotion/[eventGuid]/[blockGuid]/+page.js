import { remoteServer } from '$/stores';

export async function load({ params, fetch, url }) {
	const entry = await fetch(
		remoteServer +
			`/api/sk/getpromotion?eventGuid=${params.eventGuid}&blockGuid=${params.blockGuid}`
	);
	let data = (await entry.json()).block || {};
	console.log(data);
	return data;
}
