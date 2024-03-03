import { remoteServer } from '$/stores';

export default function remoteSave(blocks, guid) {
	if (!guid) {
		throw new Error('guid is required');
	}
	if (guid !== 'test') {
		fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks, guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				if (newData.status !== 'success') {
					alert('You are no longer logged in, and your changes are not being saved.');
				}
			})
			.catch((error) => console.error(error));
	}
}
