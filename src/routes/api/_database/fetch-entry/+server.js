import { json, error } from '@sveltejs/kit';
import { getCollection } from '../_db/connect';

export async function GET({ url }) {
	try {
		const collection = await getCollection('users');
		const uuid = url.searchParams.get('uuid');
		let catalog = {};

		if (uuid) {
			const result = await collection.findOne({ 'catalog.uuid': uuid });

			if (result) {
				catalog = result.catalog.find((cat) => cat.uuid === uuid);
			}
		}

		return json(catalog);
	} catch (err) {
		console.error('Error: ', err);
		throw error(500);
	}
}
