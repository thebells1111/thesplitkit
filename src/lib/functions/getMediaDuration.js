export default function getMediaDuration(url) {
	console.log(url);
	return new Promise((resolve, reject) => {
		const audio = new Audio();
		audio.preload = 'metadata'; // Load only metadata, not the entire file
		audio.src = url;

		audio.onloadedmetadata = () => {
			resolve(audio.duration);
			audio.remove();
		};

		audio.onerror = (error) => {
			reject(error);
			audio.remove();
		};
	});
}
