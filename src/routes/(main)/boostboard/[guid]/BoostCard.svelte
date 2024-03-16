<script>
	export let boost;
</script>

<boost-card>
	<top>
		<span>{boost.sender_name ? boost.sender_name : 'anonymous'}</span>
		<span>boosted {boost.value_msat_total / 1000} sats</span>
		{#if boost.app_name}
			<span> from {boost.app_name}</span>
		{/if}
	</top>
	{#if boost.message}
		<message>{boost.message}</message>
	{/if}
</boost-card>

<style>
	boost-card {
		display: flex;
		padding: 1rem;
		margin: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		flex-direction: column;
	}

	top {
		display: block;
		font-weight: bold;
	}

	message {
		display: block;
		overflow-wrap: break-word;
		margin: 12px 0 0 12px;
	}
</style>
