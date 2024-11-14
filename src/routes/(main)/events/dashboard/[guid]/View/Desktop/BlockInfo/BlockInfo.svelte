<script>
	export let block = {
		title: '',
		line: ['', ''],
		link: { text: '', url: '' }
	};
</script>

<label>
	<h4>Title</h4>
	<input bind:value={block.title} />
</label>

<label>
	<h4>Line 1</h4>
	<input bind:value={block.line[0]} />
</label>

<label>
	<h4>Line 2</h4>
	<input bind:value={block.line[1]} />
</label>

<label>
	<h4>Link Text</h4>
	<input bind:value={block.link.text} />
</label>

<label>
	<h4>Link Url</h4>
	<input bind:value={block.link.url} />
</label>

<style>
	label {
		display: block;
		color: var(--color-theme-blue);
		margin: 0;
	}

	h4 {
		margin: 2px 0;
	}
	input {
		margin-left: 4px;
		width: calc(100% - 16px);
		height: 21px;
	}
</style>
