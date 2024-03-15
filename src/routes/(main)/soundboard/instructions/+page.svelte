<ol>
	<li>
		In your feed, make sure there's an item or liveItem for your episode. Your feed and item must
		both have a unique guid. This is important. The feedGuid and itemGuid are how TSK will know
		where to send each boost trigger.
	</li>
	<li>
		Add The Split Kit to your episode value block. <a
			href="https://getalby.com/.well-known/keysend/thesplitkit"
			>https://getalby.com/.well-known/keysend/thesplitkit</a
		> TSK needs to be in your value block, because I need to get the TLV record sent to me. This will
		also be a webhook in the future, so you can use your own server, but for now, TSK needs to be in
		your value block.
	</li>
	<li>Publish your feed and wait for the episode to show up in the Podcast Index.</li>
	<li>
		In TSK, create a new event (or modify an existing one if you know wha you're doing), and select
		anything but Prerecorded.
	</li>
	<li>
		Your default block needs to be your episode. Find it by selecting a Podcast Block, searching for
		your Podcast, then adding your episode. Now close out of this screen and you'll see your default
		block is your episode.
	</li>
	<li>In the main menu, you should see Sound Board, click that.</li>
	<li>
		Provide a link to an audio file if you want a default sound to play. If no link is there, then
		there is no default sound.
	</li>
	<li>
		Click Add Sound, and you can add another link to a different audio file. Add Boost amount to
		trigger that sound.
	</li>
	<li>
		Whenever you have this page open, and someone boosts your episode, that sound will be played.
	</li>
</ol>

<style>
	li {
		margin-bottom: 8px;
	}
</style>
