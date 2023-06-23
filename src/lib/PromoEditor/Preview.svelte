<script>
	import Info from '$lib/icons/Info.svelte';
	import Close from '$lib/icons/Close.svelte';
	import clone from 'just-clone';
	export let block = {
		image: '',
		title: '',
		line: [],
		link: { text: '', url: '' },
		description: '',
		value: { type: 'lightning', method: 'keysend', destinations: [] },
		totalPercentage: 0,
		totalPercentage: 0
	};

	let newBlock = {
		image: '',
		title: '',
		line: [],
		link: { text: '', url: '' },
		description: '',
		value: { type: 'lightning', method: 'keysend', destinations: [] },
		totalPercentage: 0,
		totalPercentage: 0
	};

	$: if (block) {
		newBlock = clone(block);
		newBlock.line = newBlock.line
			.map((v) => {
				{
					if (v !== 'Text - click to edit') {
						return v;
					} else {
						return '';
					}
				}
			})
			.filter((v) => v);
		if (newBlock.title === 'Title - click to edit') {
			newBlock.title = '';
		}
		if (newBlock.link.text === 'Link - click to edit') {
			newBlock.link.text = '';
		}
		if (!newBlock.link.text || !newBlock.link.url) {
			newBlock.link = { text: '', url: '' };
		}
	}

	let showInfoModal = false;
	function closeInfoModal() {
		showInfoModal = false;
	}
</script>

<container>
	<h1>
		{newBlock.title || ''}
	</h1>

	<img-container>
		<img class="image" src={newBlock.image || '/splitkit300.png'} alt="live artwork" />
		{#if newBlock.description}
			<button
				on:click={() => {
					showInfoModal = true;
				}}
				class="info"
			>
				<white-background />
				<Info size="32" />
			</button>
		{/if}
	</img-container>
	<h2>
		{newBlock.line[0] || ''}
	</h2>
	<h3>
		{newBlock.line[1] || ''}
	</h3>

	{#if newBlock.link.text && newBlock.link.text}
		<a href={newBlock.link.url}>
			{newBlock.link.text}
		</a>
	{/if}
	<button class="boost"> Boost 🚀 </button>
</container>

{#if showInfoModal}
	<blurred-background
		class="info"
		on:mousedown|self={closeInfoModal}
		on:touchend|self={closeInfoModal}
	>
		<info-modal>
			<button class="close icon" on:click={closeInfoModal}>
				<Close size="24" />
			</button>
			<h2>Notes</h2>
			<textarea value={block.description} readonly />
		</info-modal>
	</blurred-background>
{/if}

<style>
	container {
		max-width: 450px;
		min-width: 300px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
	}

	h1 {
		text-align: center;
		margin: 4px 0 0 0;
		min-height: 1.6em;
		width: 100%;
	}

	h2 {
		text-align: center;
		margin-top: 4px;
		min-height: 1.5em;
		width: 100%;
	}
	h3 {
		text-align: center;
		margin-top: 0;
		min-height: 1.5em;
		flex: 1;
		width: 100%;
	}

	a {
		text-align: center;
		margin-top: 0;
		min-height: 1.5em;
		font-size: 1.2em;
		font-weight: bold;
		flex: 1;
	}

	img-container {
		position: relative;
	}

	img {
		width: 300px;
	}

	button {
		background-color: rgb(0, 132, 180);
		color: white;
		padding: 4px 12px;
		border: 1px solid transparent;
		border-radius: 25px;
		font-size: 1.05em;
		cursor: pointer;
		margin: 8px 0 16px 0;
		height: 50px;
		width: 284px;
	}

	.boost {
		width: calc(100% - 16px);
		background-color: #ff6680;
		color: white;
		font-weight: 600;
	}

	white-background {
		display: block;
		position: absolute;
		background-color: white;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		z-index: -1;
	}
	button.info {
		position: absolute;
		bottom: -4px;
		right: 4px;
		width: initial;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background-color: transparent;
		color: hsl(283, 99%, 49%);
		box-shadow: none;
		filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
	}

	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}
	info-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
	}

	info-modal h2 {
		margin: 16px 0 8px 0;
		height: initial;
		min-height: initial;
	}

	textarea {
		width: calc(100% - 32px);
		height: calc(100% - 32px);
		resize: none;
		margin: 8px 0;
		padding: 4px;
		border: none;
		outline: none;
	}
	button.close {
		position: absolute;
		top: -4px;
		right: -4px;
		background-color: transparent;
		padding: 8px;
		color: rgba(0, 0, 0, 0.75);
		z-index: 33;
		border: 1px solid transparent;
		width: initial;
		margin: 0;
		height: initial;
	}

	@media screen and (max-width: 992px) {
	}
</style>
