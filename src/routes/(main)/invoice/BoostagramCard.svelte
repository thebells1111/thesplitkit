<script>
	export let boostagram;
</script>

<div>
	<p>{new Date(boostagram?.created)}</p>
	<p>{boostagram?.comment}</p>
	<p>{boostagram?.amount}</p>
	<p>{boostagram?.name}</p>
</div>

<style>
	div {
		width: 75%;
		border: 1px solid black;
		border-radius: 8px;
		margin: 8px;
		padding: 8px;
	}
</style>
