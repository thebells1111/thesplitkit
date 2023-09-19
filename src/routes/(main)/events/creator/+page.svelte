<script>
	import Event from '$lib/icons/Event.svelte';
	import SmallModal from '$lib/Modal/SmallModal.svelte';
	import { remoteServer } from '$/stores';
	import { goto } from '$app/navigation';
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
			goto('/events/dashboard/' + data.guid);
		}
	}

	let showHelpModal = false;
	let helpText = ``;

	function showHelp(type) {
		showHelpModal = true;
		helpText = texts[type];
	}

	const texts = {
		manual: `<p>In manual, there's no auto switching of the blocks.</p>
		<p>
			It's useful for live events like a conference or debate where there's someone available to
			quickly update the blocks as the speaker changes or an image needs to be displayed.
		</p>
		<p>
			It could also be used by a band doing a live set by having a Split Kit engineer changing the
			block to match the song being played so the audience can boost the song live.
		</p>`
	};
</script>

<div>
	<label>
		Event Name:
		<input bind:value={eventName} />
	</label>
</div>

<h1>Event Type</h1>

<button-container>
	<button class="selector" on:click={generateLink}> <h2>Music Show</h2> </button>
	<button class="help" on:click={showHelp.bind(this, 'manual')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink}> <h2>Podcast</h2> </button>
	<button class="help" on:click={showHelp.bind(this, 'manual')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink}> <h2>Playlist</h2> </button>
	<button class="help" on:click={showHelp.bind(this, 'manual')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink}> <h2>Prerecorded Show</h2> </button>
	<button class="help" on:click={showHelp.bind(this, 'manual')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink}> <h2>Manual</h2> </button>
	<button class="help" on:click={showHelp.bind(this, 'manual')}>?</button>
</button-container>

{#if showHelpModal}
	<SmallModal
		bind:showModal={showHelpModal}
		onClose={() => {
			helpText = '';
		}}
	>
		{@html helpText}
	</SmallModal>
{/if}

<style>
	div {
		width: calc(100% - 16px);
		max-width: 450px;
		display: flex;
		margin: 16px auto 0 auto;
		position: relative;
	}
	label {
		display: flex;
		flex-direction: column;
		margin-bottom: 16px;
		width: 100%;
	}
	button.selector {
		background-color: hsl(0, 0%, 96%);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		width: 100%;
		border-radius: 40px;
		padding: 0;
		margin: 0 8px 4px 0;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
	}

	button.help {
		background-color: var(--color-theme-yellow);
		color: var(--color-text-0);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		min-width: 50px;
		border-radius: 40px;
		padding: 0;
		margin: 0 8px 4px 0;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		font-size: 1.2em;
		font-weight: 550;
	}
	button-container {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		position: relative;
		bottom: 8px;
	}

	h1 {
		text-align: center;
		text-decoration: underline;
	}
	p {
		text-align: center;
		padding: 0;
		margin: 0;
		width: 75px;
	}
</style>
