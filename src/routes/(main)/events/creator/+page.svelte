<script>
	import Event from '$lib/icons/Event.svelte';
	import SmallModal from '$lib/Modal/SmallModal.svelte';
	import { remoteServer, mainSettings } from '$/stores';
	import { goto } from '$app/navigation';
	let eventName = '';
	async function generateLink(type) {
		$mainSettings = settings[type];
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

	const settings = {
		podcast: {
			broadcastMode: 'podcast',
			editEnclosure: '',
			podcast: { autoSwitch: true },
			splits: 95
		},
		prerecorded: {
			splits: 95,
			broadcastMode: 'edit',
			editEnclosure: '',
			podcast: { autoSwitch: true }
		},
		manual: {
			broadcastMode: 'manual',
			editEnclosure: '',
			podcast: { autoSwitch: true },
			splits: 95
		},
		manual: {
			broadcastMode: 'playlist',
			editEnclosure: '',
			podcast: { autoSwitch: true },
			splits: 95
		}
	};

	const texts = {
		manual: `<p>In manual, there's no auto switching of the blocks.</p>
		<p>
			It's useful for live events like a conference or debate where there's someone available to
			quickly update the blocks as the speaker changes or an image needs to be displayed.
		</p>
		<p>
			It could also be used by a band doing a live set by having a Split Kit engineer changing the
			block to match the song being played so the audience can boost the song live.
		</p>`,
		prerecorded: `<p>
	A prerecord podcast or music show is where you have a prerecorded audio file and you just need to
	import the Value Time Splits (wallet switching info) for the songs you played on your show.
</p>
<p>It also allows you to create chapters, show notes, and valueTimeSplits for your podcast feed.</p>
<p>
	You can import your audio file, play it, and click the blue timer for each block to mark the time
	to start the song.
</p>
<p>
	If you already know the time stamp for each block, you can click the purple tuner button to enter
	the start time.
</p>`,
		playlist: `<p>
	In Playlist mode, your blocks will auto-broadcast to the next block when the time remaining
	reaches zero. If you clicked the timer icon when you started your show, the start time for the
	next block will fill in automatically based on the timer.
</p>

<p>
	However, keep in mind that if a block has no duration in it, the time remaining is by default zero
	for that block, and that block will be skipped.
</p>
<p>
	Several music shows are using this to create their show during a live stream. When live streaming, they create a block with the value set to their value block and some background music as
	a filler block between songs so they can talk to their audience. If you choose to do this, you can
	still manually trigger the next block by clicking that blocks blue broadcast button.
</p>`,
		podcast: `<p>This a hybrid between manual and playlist mode.</p>

<p>
	For a live podcast, you may want to only play a few songs or share a few live chapters. You don't
	need to auto-switch to the next block like you would in playlist mode. Instead after the segment
	is over, you need to wallet to switch back to the podcast wallet.
</p>

<p>
	If you press the timer at the start of your show, any time you broadcast a block, the start time
	will auto fill for you based on the timer time.
</p>

<p>
	If you block has a duration, which is auto-filled for podcasts and music, then the time remaining
	will start counting down, and when the time reaches zero, your wallet will auto switch back to the
	podcast or default block.
</p>

<p>
	However, if your block doesn't have a duration, then the wallet for the active block will remain
	until you manually choose another block.
</p>

<p>This mode does not currently support playing the song in app like playlist mode does.</p>`
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
	<button class="prerecorded selector" on:click={generateLink.bind(this, 'prerecorded')}>
		<h2>Prerecorded Podcast <br />or Music Show</h2>
	</button>
	<button class="help" on:click={showHelp.bind(this, 'prerecorded')}>?</button>
</button-container><button-container>
	<button class="selector" on:click={generateLink.bind(this, 'playlist')}>
		<h2>Playlist <br /> or Live Music Show</h2>
	</button>
	<button class="help" on:click={showHelp.bind(this, 'playlist')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink.bind(this, 'podcast')}>
		<h2>Live Podcast</h2>
	</button>
	<button class="help" on:click={showHelp.bind(this, 'podcast')}>?</button>
</button-container>
<button-container>
	<button class="selector" on:click={generateLink.bind(this, 'manual')}> <h2>Manual</h2> </button>
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
