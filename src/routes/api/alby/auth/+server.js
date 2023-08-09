import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

if (!process.env.ALBY_ID) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

export async function GET({ url, cookies }) {
	let newToken;
	try {
		let code = url.searchParams.get('code') ?? '';
		var formData = new FormData();
		formData.append('code', code);

		let codeUrl;
		if (dev) {
			codeUrl = 'http://localhost:3000/api/alby/refreshauth';
		} else {
			codeUrl = 'https://www.thesplitkit.com/api/alby/refreshauth';
		}
		formData.append('grant_type', 'authorization_code');
		let resolve = await axios({
			method: 'POST',
			url: codeUrl,
			auth: {
				username: ALBY_ID,
				password: ALBY_SECRET
			},
			data: formData,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
			}
		});

		// await axios({
		// 	method: 'POST',
		// 	url: codeUrl,
		// 	auth: {
		// 		username: ALBY_ID,
		// 		password: ALBY_SECRET
		// 	},
		// 	data: {
		// 		tempCode: 'random code'
		// 	},
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	}
		// });

		newToken = jwt.sign(resolve.data, ALBY_JWT, {
			expiresIn: '10d'
		});

		json({ success: true, data: resolve.data });
	} catch (err) {
		if (newToken) {
			cookies.set('awt', newToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: 60 * 60 * 24 * 30
			});
			json({ success: false });
		}

		console.error('alby err: ', err);
		throw error(500, { message: err.response?.data?.error_description });
	}
}
