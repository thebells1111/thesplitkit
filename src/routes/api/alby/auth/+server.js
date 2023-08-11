import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

import { error, json } from '@sveltejs/kit';
import { dev } from '$app/environment';

if (!process.env.ALBY_ID) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

let ts = {};

export async function GET({ url, cookies }) {
	console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
	console.log(ALBY_JWT);
	let newToken;
	try {
		let code = url.searchParams.get('code') ?? '';
		let redirect_uri = url.searchParams.get('redirect_uri') ?? '';

		var formData = new FormData();
		formData.append('code', code);
		formData.append('redirect_uri', redirect_uri);
		formData.append('grant_type', 'authorization_code');

		let resolve = await axios({
			method: 'POST',
			url: 'https://api.getalby.com/oauth/token',
			auth: {
				username: ALBY_ID,
				password: ALBY_SECRET
			},
			data: formData,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
			}
		});

		newToken = jwt.sign(resolve.data, ALBY_JWT, {
			expiresIn: '10d'
		});

		cookies.set('awt', newToken, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		const [account, balance] = await Promise.all([
			axios({
				url: 'https://api.getalby.com/user/value4value',
				headers: { Authorization: `Bearer ${resolve.data.access_token}` }
			}).catch((error) => {
				console.log('error: ', error.response.data);
				throw error; // Propagate error up to outer catch block
			}),

			axios({
				url: 'https://api.getalby.com/balance',
				headers: { Authorization: `Bearer ${resolve.data.access_token}` }
			}).catch((error) => {
				console.log('error: ', error.response.data);
				throw error; // Propagate error up to outer catch block
			})
		]);

		let user = { ...account.data, ...balance.data };

		ts.user = user;

		let codeUrl;
		if (dev) {
			codeUrl = 'http://localhost:8000/api/alby/refreshauth';
		} else {
			codeUrl = 'https://www.thesplitkit.com/api/alby/refreshauth';
		}

		ts.codeUrl = codeUrl;

		let randomCode = 'random-code';
		const tempCode = { code: randomCode, data: resolve.data };

		await axios({
			method: 'POST',
			url: codeUrl,
			data: tempCode,
			headers: {
				'Content-Type': 'application/json'
			}
		});

		return json({ ...user, code: randomCode });
	} catch (err) {
		cookies.set('awt', '', {
			path: '/',

			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 * 24 * 30
		});

		console.log('***************************************************');
		console.log('');
		console.log('***************************************************');
		console.error('alby err: ', err);
		console.log('***************************************************');
		console.log('');
		console.log('***************************************************');
		return json(ts);
		throw error(500, { message: err.response?.data?.error_description });
	}
}
