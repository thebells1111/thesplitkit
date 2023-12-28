import { json, error } from '@sveltejs/kit';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';

if (!process.env.ALBY_ID) {
	dotenv.config();
}

const { ALBY_JWT } = process.env;

export async function POST({ request, cookies }) {
	const record = await request.json();
	console.log(ALBY_JWT);
	console.log(cookies.get('awt'));

	let albyToken = cookies.get('awt') ? jwt.verify(cookies.get('awt'), ALBY_JWT) : undefined;

	let resolve = await axios({
		method: 'POST',
		url: 'https://api.getalby.com/payments/keysend/multi',
		headers: { Authorization: `Bearer ${albyToken?.access_token}` },
		data: { keysends: record }
	}).catch((error) => {
		console.log('error: ', error.response.data);
		return {
			status: 500,
			body: { message: error.response.data }
		};
	});

	console.log(resolve.data);
	return json(record);
}
