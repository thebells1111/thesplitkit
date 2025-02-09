function removeAtSign(data) {
	let dataArray = [].concat(data);

	let cleanedData = dataArray.map((item) => {
		const newItem = {};

		for (let key in item) {
			const newKey = key.replace('@_', ''); // Creates new key without '@_'
			newItem[newKey] = item[key];
		}

		return newItem;
	});

	return cleanedData;
}

export default removeAtSign;
