import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { json, error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { refreshToken, getUserInfo, checkAwtCookie } from '../helpers';

if (!process.env.ALBY_JWT) {
	dotenv.config();
}

const { ALBY_JWT } = process.env;

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

			if (refreshedToken) {
				const newToken = jwt.sign(refreshedToken, ALBY_JWT, {
					expiresIn: '10d'
				});
				cookies.set('awt', newToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: !dev,
					maxAge: 60 * 60 * 24 * 30
				});

				const data = await getUserInfo(refreshedToken);

				return json(data);
			}
		}

		return json({ loggedIn: false });
	} catch (err) {
		console.log('alby err: ', err);
		throw error(500);
	}
}
