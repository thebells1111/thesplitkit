<script>
	import { onMount, beforeUpdate } from 'svelte';
	import Delete from '$lib/icons/Delete.svelte';
	import CopyIcon from '$lib/icons/Copy.svelte';
	import { remoteServer, albyReady, copiedEvent } from '$/stores';
	import Eye from '$lib/icons/Eye.svelte';
	import Event from '$lib/icons/Event.svelte';
	import Save from '$lib/icons/Save.svelte';

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

	function handleCopy(event) {
		console.log(event);
		$copiedEvent = event;
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
			<a class="create" href="/events/creator">
				<p>Create New Event</p>
				<Event size="30" />
			</a>
			{#each events as event}
				<a
					href={screenWidth > 760
						? '/events/dashboard/' + event.guid
						: '/events/dashboard/' + event.guid}
				>
					<button class="copy" on:click|preventDefault={handleCopy.bind(this, event)}>
						<icon>
							<CopyIcon size="20" />
						</icon>
					</button>
					<p>{event.eventName}</p>

					<button on:click|preventDefault={deleteEvent.bind(this, event)}>
						<Delete size="24" />
					</button>
				</a>
			{/each}

			{#if $copiedEvent}
				<a class="copy" href={`/events/creator/${$copiedEvent.guid}`}>
					<p>Paste Copied Event</p>
					<CopyIcon size="30" />
				</a>
			{/if}
		</events-container>
	{/if}
</container>

<style>
	container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}
	events-container {
		display: block;
		width: 100%;
		max-width: 760px;
		height: 100%;
		overflow: auto;
	}
	h2 {
		text-decoration: underline;
		text-align: center;
		margin: 4px 0;
	}

	a {
		padding: 12px 8px;
		display: flex;
		margin: 8px 16px;
		box-shadow: 0 2px 8px 0px rgba(0, 0, 0, 0.75);
		border-radius: 8px;
		border: 1px solid transparent;
		position: relative;
		text-decoration: none;
		font-weight: bold;
		color: var(--color-text-0);
		justify-content: space-between;
		align-items: center;
	}

	a.create {
		background-color: var(--color-theme-light-yellow);
	}

	a.copy {
		background-color: var(--color-theme-light-blue);
	}

	p {
		margin: 0 8px;
		flex: 1;
	}

	button {
		padding: 2px;
		color: var(--color-text-1);
		background-color: hsl(0, 100%, 32%);
		width: 30px;
		height: 30px;
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

	.copy {
		background-color: var(--color-theme-blue);
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
