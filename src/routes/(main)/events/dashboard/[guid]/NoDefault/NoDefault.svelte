<script>
	import PersonIcon from '$lib/icons/Person.svelte';
	import PodcastIcon from '$lib/icons/Podcast.svelte';

	export let showAddDefaultModal;
	export let addDefaultType;

	function handleSelect(type) {
		showAddDefaultModal = true;
		addDefaultType = type;
	}
</script>

<h4>Let's create a 'default' block.</h4>

<p>This is the fallback block for whenever you're not broadcasting another block.</p>
<button on:click={handleSelect.bind(this, 'podcast')}>
	<icon>
		<PodcastIcon size="40" />
	</icon>
	Podcast
</button>
<button on:click={handleSelect.bind(this, 'custom')}>
	<icon>
		<PersonIcon size="40" />
	</icon>
	Custom
</button>
<h4>Select a type</h4>

<p>
	The value block for your default block will also be used to send your split of the Boosts to you.
	When you add other blocks to broadcast, if you set that blocks split to 95%, then the remaining 5%
	will be split amongst your 'default' block.
</p>

<p>
	If you're using this as a Podcaster to broadcast a live episode, add your live episode to your
	feed and click podcat above to add that episode as your default block.
</p>

<p>
	If you're using the Split Kit for a conference, live concert, or as a DJ, you can use the value
	block from your podcast (if you have one), or create a custom value block. The custom value block
	would handle how the splits to the default block are handled.
</p>

<p>
	For example, if you were using this at a conference, 50% of the splits for this block could go to
	the conference organizer, and 50% goes to the operator broadcasting events with the Split Kit. Or
	a venue using the Split Kit to allow the audience to Boost the band, could take a 50% cut, with
	25% to the sound engineer, and 25% to the Split Kit operator.
</p>

<style>
	div {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	button {
		box-shadow: none;
		background-color: transparent;
		color: var(--color-text-0);
		display: flex;
		flex-direction: column;
	}

	icon {
		display: block;
		width: 50px;
		height: 50px;
		background-color: hsl(0, 0%, 96%);
		border-radius: 25px;
		box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.5);
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
