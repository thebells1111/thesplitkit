<script>
	import { events, mainSettings } from '$/stores';

	let selectedEvent = '';
	let guid = '';

	function updateGuid() {
		const event = $events.find((e) => e.eventName === selectedEvent);
		guid = event ? event.guid : '';
		$mainSettings.relayGuid = guid;
	}
</script>

<label>
	What event do you want to relay?
	<select bind:value={selectedEvent} on:change={updateGuid}>
		<option value="" disabled>Select an event</option>
		{#each $events as event}
			<option value={event.eventName}>{event.eventName}</option>
		{/each}
	</select>
</label>

<p>Selected GUID: {guid}</p>
