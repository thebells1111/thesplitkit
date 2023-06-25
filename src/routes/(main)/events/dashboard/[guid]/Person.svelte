<script>
	export let blocks = [];
	export let handleBroadcast = () => {};
	export let broadcastingBlockIndex;

	function broadcast(block, index) {
		broadcastingBlockIndex = index;
		handleBroadcast(block);
	}

	function getTitle(block) {
		let text = block.title || block.feedTitle || '';
		console.log(text);
		text = text === 'undefined' ? '' : text;
		return text;
	}

	function getLine0(block) {
		let text = block?.line?.[0] || block.itemTitle || '';
		text = text === 'undefined' ? '' : text;
		return text;
	}
</script>

<h2>Speakers</h2>
<div>
	{#each blocks as block, index}
		<person>
			<button
				class:active={broadcastingBlockIndex === index}
				on:click={broadcast.bind(this, block, index)}
			>
				<img src={block.image || '/splitkit300.png'} alt="person's headshot" />
			</button>
			<p>{`${getTitle(block)}`}</p>
			<p>{`${getLine0(block)}`}</p>
		</person>
	{/each}
</div>

<style>
	h2 {
		margin: 0;
		z-index: 2;
	}
	div {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
		grid-auto-rows: 1fr;
		gap: 10px;
		margin-top: 8px;
		width: calc(100% - 16px);
		align-items: start;
		justify-items: center;
	}

	person {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	person p {
		padding: 0;
		margin: 4px 0 0 0;
		text-align: center;
		word-wrap: normal;
		width: 100%;
	}

	button {
		border: none;
		background: none;
		padding: 0;
		width: 100px;
		height: 100px;
		border-radius: 50px;
	}

	button.active {
		box-shadow: 0 0px 5px 5px rgba(0, 132, 180, 0.75);
	}

	img {
		width: 100px;
		height: 100px;
		border-radius: 50px; /* makes the image a circle */
		object-fit: cover; /* ensures the aspect ratio of the image is maintained */
	}
</style>
