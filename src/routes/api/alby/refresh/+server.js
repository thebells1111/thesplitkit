import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { json, error } from '@sveltejs/kit';
import axios from 'axios';
import { dev } from '$app/environment';
import { refreshToken, getUserInfo, checkAwtCookie } from '../helpers';

if (!process.env.ALBY_JWT) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

export async function GET({ cookies }) {
	try {
		const { token, error } = await checkAwtCookie(cookies);
		if (!token) {
			if (error) {
				console.error('Token verification error:', error);
			}
			cookies.set('awt', '', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: 0
			});

			return json({ loggedIn: false, name: '' });
		}

		if (token) {
			const refreshedToken = await refreshToken(token);
			const newToken = jwt.sign(refreshedToken, ALBY_JWT, {
				expiresIn: '10d'
			});
			if (newToken) {
				cookies.set('awt', newToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: !dev,
					maxAge: 60 * 60 * 24 * 30
				});

				const data = await getUserInfo(refreshedToken);

				let codeUrl;
				if (dev) {
					codeUrl = 'http://localhost:8000/api/alby/refreshauth';
				} else {
					codeUrl = 'https://www.thesplitkit.com/api/alby/refreshauth';
				}

				let randomCode = 'random-code';
				const tempCode = { code: randomCode, data: refreshedToken };

				await axios({
					method: 'POST',
					url: codeUrl,
					auth: {
						username: ALBY_ID,
						password: ALBY_SECRET
					},
					data: tempCode,
					headers: {
						'Content-Type': 'application/json'
					}
				});

				return json({ ...data, code: randomCode });
			}
		}

		return json({ loggedIn: false });
	} catch (err) {
		console.log('alby err: ', err);
		throw error(500);
	}
}
