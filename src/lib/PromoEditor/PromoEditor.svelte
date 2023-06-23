<script>
	import Modal from '$lib/Modal/Modal.svelte';
	import Close from '$lib/icons/Close.svelte';
	import EditSquare from '$lib/icons/EditSquare.svelte';
	import ValueBlock from '$lib/ValueBlock/ValueBlock.svelte';
	import Preview from './Preview.svelte';
	import SaveModal from '$lib/Modal/SaveModal.svelte';
	import EditorHeader from './EditorHeader.svelte';
	import clone from 'just-clone';
	import Info from '$lib/icons/Info.svelte';
	let block;

	export let baseBlock = {
		image: '',
		title: 'Title - click to edit',
		line: ['Text - click to edit', 'Text - click to edit'],
		link: { text: 'Link - click to edit', url: '' },
		description: '',
		value: { type: 'lightning', method: 'keysend', destinations: [] },
		settings: {
			totalPercentage: 0
		}
	};
	$: cloneBlock(baseBlock);

	console.log(block);

	function cloneBlock() {
		block = clone(baseBlock);
		setTimeout(() => {
			unsaved = false;
		}, 0);
	}

	$: if (block) {
		unsaved = true;
	}

	export let saveState = () => {};

	let showLinkModal = false;
	let showValueModal = false;
	let showImageModal = false;
	let showInfoModal = false;
	let showPreview = false;
	let showSaveModal = false;
	export let unsaved = false;

	function closeLinkModal() {
		showLinkModal = false;
	}

	function closeImageModal() {
		showImageModal = false;
	}

	function closeInfoModal() {
		showInfoModal = false;
	}

	const calculateTotalPercentage = () => {
		block.settings.totalPercentage = block.value.destinations.reduce(
			(acc, person) => acc + parseFloat(person.split || 0),
			0
		);
	};

	function handleFocus(event, line, text) {
		if (line === text) {
			// Asynchronously select text to allow for render updates
			setTimeout(() => {
				const range = document.createRange();
				const sel = window.getSelection();
				range.selectNodeContents(event.target);
				sel.removeAllRanges();
				sel.addRange(range);
			}, 0);
		}
	}
</script>

{#if block}
	<container>
		<h1
			contenteditable="true"
			bind:innerText={block.title}
			on:blur={() => {
				if (!block.title || /^[\s]*$/.test(block.title)) {
					block.title = 'Title - click to edit';
				}
			}}
			on:focus={(e) => handleFocus(e, block.title, 'Title - click to edit')}
		>
			{block.title}
		</h1>

		<image-editor>
			<button
				class="img-edit"
				on:click={() => {
					showImageModal = true;
				}}
			>
				<postioner>
					<EditSquare size="24" />
				</postioner>
			</button>
			<img
				class="image"
				src={block.image || '/splitkit300.png'}
				alt="live artwork"
				width="300"
				height="300"
			/>
			<button
				on:click={() => {
					showInfoModal = true;
				}}
				class="info"
			>
				<white-background />
				<Info size="32" />
			</button>
		</image-editor>
		<h2
			contenteditable="true"
			bind:innerText={block.line[0]}
			on:blur={() => {
				if (!block.line[0] || /^[\s]*$/.test(block.line[0])) {
					block.line[0] = 'Text - click to edit';
				}
			}}
			on:focus={(e) => handleFocus(e, block.line[0], 'Text - click to edit')}
		>
			{block.line[0]}
		</h2>
		<h3
			contenteditable="true"
			bind:innerText={block.line[1]}
			on:blur={() => {
				if (!block.line[1] || /^[\s]*$/.test(block.line[1])) {
					block.line[1] = 'Title - click to edit';
				}
			}}
			on:focus={(e) => handleFocus(e, block.line[1], 'Text - click to edit')}
		>
			{block.line[1]}
		</h3>

		<a
			href="#"
			on:click={() => {
				showLinkModal = true;
			}}>{block.link.text}</a
		>

		<button
			class="boost"
			on:click={() => {
				showValueModal = true;
			}}>Edit Boost 🚀</button
		>
	</container>
{/if}

<EditorHeader {block} {saveState} bind:unsaved bind:showPreview />

{#if showLinkModal}
	<blurred-background
		class="link"
		on:mousedown|self={closeLinkModal}
		on:touchend|self={closeLinkModal}
	>
		<link-modal>
			<button class="close icon" on:click={closeLinkModal}>
				<Close size="24" />
			</button>
			<label>
				Link Text:
				<input bind:value={block.link.text} />
			</label>
			<label>
				Link Url:
				<input type="url" bind:value={block.link.url} />
			</label>
		</link-modal>
	</blurred-background>
{/if}

{#if showImageModal}
	<blurred-background
		class="image"
		on:mousedown|self={closeImageModal}
		on:touchend|self={closeImageModal}
	>
		<image-modal>
			<button class="close icon" on:click={closeImageModal}>
				<Close size="24" />
			</button>
			<img class="preview-image" width="150" height="150" src={block.image} />
			<label>
				Link to Image:
				<input type="url" bind:value={block.image} />
			</label>
		</image-modal>
	</blurred-background>
{/if}

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
			<textarea bind:value={block.description} />
		</info-modal>
	</blurred-background>
{/if}

{#if showValueModal}
	<Modal bind:showModal={showValueModal}>
		<ValueBlock bind:data={block} {calculateTotalPercentage} bind:unsaved />
	</Modal>
{/if}

{#if showPreview}
	<Modal bind:showModal={showPreview}>
		<Preview {block} />
	</Modal>
{/if}

{#if showSaveModal}
	<SaveModal>
		<h1>Saved</h1>
	</SaveModal>
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

	img {
		width: 300px;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
		border-radius: 8px;
	}

	.image {
		min-width: 300px;
		min-height: 300px;
	}

	image-editor {
		display: block;
		position: relative;
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

	image-editor button.img-edit {
		position: absolute;
		top: -4px;
		right: 4px;
		width: initial;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
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
	image-editor button.info {
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

	.boost {
		width: calc(100% - 16px);
		background-color: #ff6680;
		color: white;
		font-weight: 600;
	}

	.preview-image {
		border: 1px solid black;
		width: 150px;
		height: 150px;
		margin-bottom: 8px;
	}

	button:disabled {
		color: rgb(206, 206, 206);
		cursor: not-allowed;
		filter: none;
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

	blurred-background.link {
		align-items: flex-end;
	}

	blurred-background.image {
		align-items: center;
	}

	link-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		width: 300px;
		height: 150px;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
		margin-bottom: 100px;
	}

	image-modal {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 300px;
		height: 300px;
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.4);
		margin-bottom: 100px;
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
		border: 1px solid black;
	}

	link-modal label,
	image-modal label {
		display: flex;
		flex-direction: column;
		margin: 8px;
		font-weight: bold;
		width: calc(100% - 16px);
	}

	link-modal label input,
	image-modal label input {
		margin: 4px 8px;
		padding: 4px;
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
