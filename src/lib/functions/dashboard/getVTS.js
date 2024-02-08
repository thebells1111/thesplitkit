export default function getVTS(episodeRSS) {
	const valueTimeSplits = episodeRSS?.['podcast:value']?.['podcast:valueTimeSplit'];

	// Ensure valueTimeSplits is always treated as an array
	const normalizedValueTimeSplits = [].concat(valueTimeSplits || []);

	const processedValueTimeSplits = normalizedValueTimeSplits
		.map((vts) => removePrefixes(vts))
		?.sort((a, b) => a.startTime - b.startTime);

	// Return undefined if the processed array is empty
	return processedValueTimeSplits.length > 0 ? processedValueTimeSplits : undefined;
}

function removePrefixes(obj) {
	if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

	const newObject = {};
	Object.keys(obj).forEach((key) => {
		let newKey = key;
		if (newKey.startsWith('@_')) {
			newKey = newKey.substring(2);
		} else if (newKey.startsWith('podcast:')) {
			newKey = newKey.substring(8);
		}

		const value = obj[key];
		newObject[newKey] = typeof value === 'object' && value !== null ? removePrefixes(value) : value;
	});
	return newObject;
}
