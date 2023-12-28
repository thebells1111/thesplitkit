// Import necessary modules
import { v4 as uuidv4 } from 'uuid';
import { getUserInfo, checkAwtCookie } from '../../alby/helpers';
import { json, error } from '@sveltejs/kit';
import { getCollection } from '../_db/connect';

// Function to generate Base64 encoded UUID
function generateUuid() {
	const uuidBase64 = Buffer.from(uuidv4()).toString('base64');
	return uuidBase64;
}

export async function POST({ request, cookies }) {
	try {
		// Parse request body
		const data = await request.json();
		console.log(data);

		// Validate request data
		if (
			!data ||
			!data.name ||
			data.settings.totalPercentage !== 100 ||
			!Array.isArray(data.value.destinations) ||
			data.value.destinations.some((item) => !item.split || !item.address)
		) {
			throw new Error('Invalid request data');
		}

		// Verify AWT cookie
		const { token } = await checkAwtCookie(cookies);
		if (!token) {
			throw new Error('Token verification error');
		}

		// Get user info based on token
		let { name } = await getUserInfo(token);

		if (!name) {
			throw new Error('Failed to get user info');
		}

		// Get the users collection from the database
		const collection = await getCollection('users');

		// Generate a Base64 encoded UUID if not provided
		const uuidBase64 = data.uuid || generateUuid();

		// Define the fields to update
		const updateFields = {
			'catalog.$.name': data.name,
			'catalog.$.value': data.value.destinations,
			'catalog.$.settings.totalPercentage': data.settings.totalPercentage,
			'catalog.$.updatedAt': new Date()
		};

		// Remove the imageLink and websiteLink fields if they are not provided in the input data
		if (data.imageLink !== undefined) {
			updateFields['catalog.$.imageLink'] = data.imageLink;
		} else {
			updateFields['catalog.$.imageLink'] = undefined;
		}

		if (data.websiteLink !== undefined) {
			updateFields['catalog.$.websiteLink'] = data.websiteLink;
		} else {
			updateFields['catalog.$.websiteLink'] = undefined;
		}

		// Update the catalog entry in the user's document
		const { value: user } = await collection.findOneAndUpdate(
			{ name, 'catalog.uuid': uuidBase64 },
			{
				$set: updateFields
			},
			{
				// Return the updated document
				returnDocument: 'after'
			}
		);
		if (!user) {
			// Create a new catalog entry if the item doesn't exist
			const newCatalogEntry = {
				uuid: uuidBase64,
				name: data.name,
				value: data.value.destinations,
				totalPercentage: data.settings.totalPercentage,
				createdAt: new Date(),
				updatedAt: new Date()
			};

			// Add the imageLink and websiteLink fields if they are provided in the input data
			if (data.imageLink !== undefined) {
				newCatalogEntry.imageLink = data.imageLink;
			}

			if (data.websiteLink !== undefined) {
				newCatalogEntry.websiteLink = data.websiteLink;
			}

			await collection.updateOne(
				{ name },
				{
					$push: {
						catalog: {
							$each: [newCatalogEntry],
							$position: 0
						}
					}
				}
			);

			return json(newCatalogEntry);
		}

		// Get the updated data object
		const updatedData = user.catalog.find((item) => item.uuid === uuidBase64);

		// Return the updated data object
		return json(updatedData);
	} catch (err) {
		console.error('wpUpdate error:', err);
		return error(500, err.message);
	}
}
