<script>
	import { onMount, beforeUpdate } from 'svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import { remoteServer, albyReady } from '$/stores';

	let events = [];
	let initiate = false;
	let loading = true;
	let screenWidth;

	$: if (initiate && $albyReady) {
		getEvents();
	}
	onMount(() => {
		initiate = true;
		screenWidth = window.innerWidth;
		window.addEventListener('resize', updateScreenWidth); // update screen width on window resize
	});

	beforeUpdate(() => {
		window.removeEventListener('resize', updateScreenWidth); // remove listener when the component is about to update
	});

	function updateScreenWidth() {
		screenWidth = window.innerWidth;
	}

	async function getEvents() {
		setTimeout(() => (loading = false), 1000);
		let res = await fetch(remoteServer + '/api/sk/getevents', { credentials: 'include' });
		let data = await res.json();
		events = data.events || [];
		console.log(events);
	}

	async function deleteEvent(eventObj) {
		let remove = confirm(`Are you sure you want to delete ${eventObj.eventName}?`);
		if (remove) {
			events = events.filter((v) => eventObj.guid !== v.guid);
			let res = await fetch(remoteServer + '/api/sk/deleteguid?guid=' + eventObj.guid, {
				credentials: 'include'
			});
			let data = await res.json();
			console.log(data);
		}
	}
</script>

<container>
	<h2>Events</h2>
	{#if loading}
		<loading>
			<img src="/splitkit300.png" />
		</loading>
	{:else}
		<events-container>
			{#each events as event}
				<div>
					<a
						href={screenWidth > 760
							? '/events/dashboard/' + event.guid
							: '/events/dashboard/' + event.guid}>{event.eventName}</a
					>
					<button on:click={deleteEvent.bind(this, event)}>
						<Delete size="24" />
					</button>
				</div>
			{/each}
		</events-container>
	{/if}
</container>

<style>
	container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	events-container {
		display: block;
		overflow: auto;
		width: 100%;
		max-width: 760px;
		overflow: auto;
	}
	h2 {
		text-decoration: underline;
		text-align: center;
		margin: 4px 0;
	}

	div {
		position: relative;
		margin: 8px 16px;
	}
	button {
		padding: 2px;
		color: var(--color-text-1);
		background-color: hsl(0, 100%, 32%);
		position: absolute;
		top: calc(50% - 15px);
		right: 8px;
	}

	a {
		padding: 12px 8px;
		display: flex;
		flex-direction: column;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		border: 1px solid transparent;
		position: relative;
		text-decoration: none;
		font-weight: bold;
		color: var(--color-text-0);
	}

	loading {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		position: relative;
	}

	img {
		width: 200px;
		height: 200px;
		animation: fade-out 1s linear;
		position: relative;
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
