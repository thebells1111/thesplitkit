<script>
	export let src = '';
</script>

<iframe title="chat" src={src || ''} />

<style>
	iframe {
		width: 100%;
		height: calc(100%);
		border: none;
	}
</style>
