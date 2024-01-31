export default function combineValues({ remotePercent, activeValue, splits }) {
	console.log(splits);
	let { baseValue, remoteValue } = splits;
	if (!remotePercent || !baseValue || !remoteValue) {
		throw new Error('combineValue missing one or more arguments');
	}

	console.log(remotePercent);
	console.log(activeValue);
	console.log(baseValue);
	console.log(remoteValue);
}
