import dotenv from 'dotenv';
import { json, error } from '@sveltejs/kit';
import { getCollection } from '../_db/connect';

import { getUserInfo, checkAwtCookie } from '../../alby/helpers';

export async function GET({ cookies }) {
	try {
		const { token, error: tokenError } = await checkAwtCookie(cookies);

		if (!token) {
			if (tokenError) {
				console.error('Token verification error:', tokenError);
			}
			return json({ loggedIn: false, name: '', balance: 0 });
		}

		const { name } = await getUserInfo(token);

		if (!name) {
			return json({ loggedIn: false, name: '' });
		}

		const collection = await getCollection('users');
		const user = await collection.findOneAndUpdate(
			{ name },
			{ $setOnInsert: { name, catalog: [] } },
			{ upsert: true, returnDocument: 'after', projection: { _id: 0 } }
		);

		return json(user.value);
	} catch (err) {
		console.error('Error: ', err);
		throw error(500);
	}
}
