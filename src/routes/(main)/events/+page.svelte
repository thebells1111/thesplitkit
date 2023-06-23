<script>
	import Eye from '$lib/icons/Eye.svelte';
	import Event from '$lib/icons/Event.svelte';
	import Save from '$lib/icons/Save.svelte';
</script>

<div>
	<route>
		<a href="/events/creator">
			<event>
				<Event size="50" />
			</event>
		</a>
		<p>Create New Event</p>
	</route>
	<route>
		<a href="/events/catalog">
			<view-saved>
				<Save size="50" />
				<eye><Eye size="20" /></eye>
			</view-saved>
		</a>
		<p>View Saved Events</p>
	</route>
</div>

<style>
	div {
		height: 100%;
		width: 100%;
		margin-top: 40px;
		display: flex;
		justify-content: space-around;
	}

	a {
		margin: 8px;
	}

	route {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	a {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;

		align-items: center;
		justify-content: center;
		height: 80px;
		width: 80px;
		border-radius: 40px;
		padding: 0;
		margin: 0 16px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	view-saved {
		display: block;
		position: relative;
	}

	eye {
		display: block;
		position: absolute;
		background-color: hsl(0, 0%, 96%);
		border-radius: 8px;
		bottom: 0;
		right: 0;
		padding: 0;
	}
</style>
