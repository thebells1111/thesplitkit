import clone from 'just-clone';
import normalizeSplitAmount from './normalizeSplitAmount';

export default function combineValues({ defaultRemotePercent, activeValue, splits }) {
	let { baseValue, remoteValue, remotePercentage } = splits;
	if (!defaultRemotePercent || !baseValue || !remoteValue || !remotePercentage) {
		throw new Error('combineValue missing one or more arguments');
	}

	console.log(defaultRemotePercent);
	console.log(activeValue);
	console.log(baseValue);
	console.log(remoteValue);
	console.log(remotePercentage);
	defaultRemotePercent = 100;

	let newDestinations = [];

	let newActive = normalizeSplitAmount(activeValue.destinations).map((v) => {
		let x = clone(v);
		x.split = x.split * ((100 - defaultRemotePercent) / 100);
		return x;
	});

	let newBaseValue = normalizeSplitAmount(baseValue.destinations).map((v) => {
		let x = clone(v);
		x.split = x.split * (defaultRemotePercent / 100) * ((100 - remotePercentage) / 100);
		return x;
	});

	let newRemoteValue = normalizeSplitAmount(remoteValue.destinations).map((v) => {
		let x = clone(v);
		x.split = x.split * (defaultRemotePercent / 100) * (remotePercentage / 100);
		return x;
	});

	newDestinations = newDestinations.concat(newActive).concat(newBaseValue).concat(newRemoteValue);

	console.log(newDestinations);
}
