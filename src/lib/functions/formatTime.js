export default function formatTime(timeInSeconds, timer) {
	let totalMilliseconds = timeInSeconds * 1000;
	let hours = Math.floor(timeInSeconds / 3600);
	let minutes = Math.floor((timeInSeconds % 3600) / 60);
	let seconds = Math.floor(timeInSeconds % 60);
	let milliseconds = Math.floor(totalMilliseconds % 1000);

	let formattedTime = '';

	if (hours > 0) {
		formattedTime += `${hours}:`;
	}

	if (minutes < 10 && hours > 0) {
		formattedTime += `0${minutes}:`;
	} else {
		formattedTime += `${minutes}:`;
	}

	if (seconds < 10) {
		formattedTime += `0${seconds}`;
	} else {
		formattedTime += `${seconds}`;
	}

	if (!timer) {
		// Include milliseconds as a three-digit decimal
		formattedTime += `.${milliseconds.toString().padStart(3, '0')}`;
	}
	return formattedTime;
}
