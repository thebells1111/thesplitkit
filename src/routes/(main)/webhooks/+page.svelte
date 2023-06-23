<script>
	import { remoteServer } from '$/stores';
	async function getWebhook() {
		fetch(remoteServer + '/api/alby/webhook/create', {
			credentials: 'include'
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
			});
	}

	async function postWebhook() {
		fetch(remoteServer + '/api/alby/webhook/settle', {
			credentials: 'include',
			method: 'POST'
		})
			.then((res) => {
				return res.text();
			})
			.then((data) => {
				console.log(data);
			});
	}
</script>

<button on:click={getWebhook}> Hook</button>
<button on:click={postWebhook}>Post Hook</button>
