<script>
	import { onMount, onDestroy } from 'svelte';
	export let screenIndex;
	export let feed;
	export let item;
	export let showFeedModal;
	import { feedShowNotes, liveBlocks } from '$/stores';

	let editor;

	let editorChangeHandlerId;

	onMount(() => {
		window.tinymce.init({
			selector: '#editor',
			plugins: 'lists link image code media charmap anchor codesample paste contextmenu',
			contextmenu: 'paste | copy | link',
			paste_data_images: false,
			paste_webkit_styles: 'none',
			menubar: '',
			toolbar:
				'undo redo | formatselect | fontsizeselect | charmap | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | image media link anchor codesample',
			toolbar_sticky: true,
			toolbar_mode: 'wrap',
			// toolbar_mode: 'floating',
			branding: false,
			resize: false,
			statusbar: false,
			height: '100%',
			width: '100%',
			paste_preprocess: function (plugin, args) {
				let h = args.content;

				// Detect if string looks like HTML
				if (/<[a-z][\s\S]*>/i.test(h)) {
					args.content = new tinymce.html.Serializer().serialize(
						new tinymce.html.DomParser().parse(h)
					);
				}

				h = h.replace(/ class="([^"]+)"/gi, '');
				h = h.replace(/ class=([\-\w]+)/gi, '');
				args.content = h;
			},
			paste_postprocess: function (plugin, args) {
				checkForUL(args.node);

				checkForLi(args.node);

				function checkForUL(node) {
					let ulNodes = node.querySelectorAll('ul');
					for (let ul of ulNodes) {
						ul.replaceWith(...ul.childNodes);
					}
				}

				function checkForLi(node) {
					let lists = node.querySelectorAll('li');
					for (let li of lists) {
						let p = document.createElement('p');
						p.innerHTML = li.innerHTML;
						checkForUL(p);
						checkForLi(p);
						li.parentNode.insertBefore(p, li);
						li.remove();
					}
				}
			},
			setup: function (e) {
				editor = e;
				editor.on('init', function () {
					editor.setContent($feedShowNotes || '');
				});
				editor.on('Paste Change input Undo Redo', function () {
					console.log('hi');
					clearTimeout(editorChangeHandlerId);
					editorChangeHandlerId = setTimeout(function () {
						$feedShowNotes = editor.getContent();
						item.description = editor.getContent();
						console.log(typeof $feedShowNotes);
						console.log(item);
					}, 100);
				});
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.remove();
		}
	});

	function importNotes() {
		editor.setContent(feed?.item?.[0]?.description || '');
		editor.fire('Change');
	}

	function generateHtmlString(data) {
		if (!data) return '';
		let htmlString = '<p>';

		console.log(data);

		data.forEach((item) => {
			if (item) {
				// Ignore items that have settings.default as true or no startTime
				console.log(item);

				// Create the link text
				let linkText = '';
				if (
					item.line[1] &&
					item.line[1] !== 'Text - click to edit' &&
					item.line[1] !== 'Title - click to edit'
				) {
					linkText = item.line[1];
					if (item.title && item.title !== 'Title - click to edit') {
						linkText += ' - ';
					}
				}

				if (item.title && item.title !== 'Title - click to edit') {
					linkText += item.title;
				}

				if (linkText) {
					htmlString += `<a href="${item.link.url}">${linkText}</a><br />`;
				}
			}
		});

		htmlString += '</p>';
		return htmlString;
	}

	async function copyToClipboard() {
		const htmlString = generateHtmlString($liveBlocks.slice(1));

		try {
			const clipboardItemInput = new ClipboardItem({
				'text/plain': new Blob([htmlString], { type: 'text/plain' }),
				'text/html': new Blob([htmlString], { type: 'text/html' })
			});

			await navigator.clipboard.write([clipboardItemInput]);
			alert('Block Copied to Clipboard');
		} catch (err) {
			alert('Error Copying to Clipboard');
		}
	}
</script>

<!-- HTML -->
<button-container>
	<button on:click={importNotes}>Import Notes from Previous Episode</button>
	<button on:click={copyToClipboard}>Copy Event Blocks</button>
</button-container>
<notes><textarea id="editor" /></notes>

<button-container>
	<button
		on:click={() => {
			screenIndex--;
		}}>Episode Info</button
	>

	<button
		on:click={() => {
			screenIndex++;
		}}>Episode Value</button
	>
</button-container>

<!-- CSS -->
<style>
	notes {
		display: flex;
		flex-direction: column;
		width: calc(100% - 16px);
		height: calc(100% - 50px);
	}
	#editor {
		width: calc(100% - 16px);
		flex: 1;
	}

	button {
		margin: 8px;
	}
	button-container {
		width: calc(100% - 16px);
		margin: 0px 0px 8px 0px;
		display: flex;
		justify-content: space-between;
	}

	button-container:first-of-type {
		margin-bottom: 0px;
	}
</style>
