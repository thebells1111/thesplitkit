<script>
	import Event from '$lib/icons/Event.svelte';
	import { remoteServer } from '$/stores';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	$: copiedGuid = $page.params.guid;
	let eventName = '';
	async function generateLink() {
		if (eventName) {
			let res = await fetch(remoteServer + '/api/sk/generateguid', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ eventName })
			});
			let data = await res.json();
			await transferBlocks(copiedGuid, data.guid);
			goto('/events/dashboard/' + data.guid);
		}
	}

	async function transferBlocks(fromGuid, toGuid) {
		const res = await fetch(remoteServer + '/api/sk/getblocks?guid=' + fromGuid);
		const data = await res.json();
		console.log(data);

		const blocks = data.blocks || [];

		await saveBlocks(blocks, toGuid);
	}

	async function saveBlocks(blocks, guid) {
		const res = await fetch(remoteServer + '/api/sk/saveblocks', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ blocks, guid })
		});
		const data = await res.json();
		console.log(data);
	}
</script>

<div>
	<label>
		New Event Name:
		<input bind:value={eventName} />
	</label>

	<button-container>
		<button on:click={generateLink}>
			<Event size="32" />
		</button>
		<p>Paste Event</p>
	</button-container>
</div>

<style>
	div {
		width: calc(100% - 16px);
		max-width: 450px;
		display: flex;
		margin: 100px auto;
		position: relative;
	}
	label {
		display: flex;
		flex-direction: column;
		margin-bottom: 16px;
		width: 100%;
	}
	button {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 50px;
		border-radius: 40px;
		padding: 0;
		margin: 0 0 4px 0;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}
	button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 75px;
		position: relative;
		bottom: 8px;
	}
	p {
		text-align: center;
		padding: 0;
		margin: 0;
		width: 75px;
	}
</style>
