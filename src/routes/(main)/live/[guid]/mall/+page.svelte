<script>
	let expandTop = true;
	let expandMiddle = true;
	let expandBottom = true;
</script>

<pane class:collapse={!expandTop && !expandMiddle && !expandBottom}>
	<top class:expand={expandTop}>
		<spacer />
		<stuff />
		<button on:click={() => (expandTop = !expandTop)}> {expandTop ? '-' : '+'} </button>
	</top>
	<middle class:expand={expandMiddle}>
		<stuff />
		<button on:click={() => (expandMiddle = !expandMiddle)}> {expandMiddle ? '-' : '+'} </button>
	</middle>
	<bottom class:expand={expandBottom}>
		<stuff />
		<button on:click={() => (expandBottom = !expandBottom)}> {expandBottom ? '-' : '+'} </button>
	</bottom>
</pane>

<style>
	pane {
		display: flex;
		flex-direction: column;
		width: calc(100%);
		height: 100%;
	}
	pane.collapse {
		height: 96px;
	}

	top,
	middle,
	bottom {
		display: block;
		height: 32px;
		width: 100%;
		border: 1px solid black;
		flex-grow: 1;
		overflow: hidden;
		position: relative;
		min-height: 32px;
	}

	stuff {
		display: block;
		width: 100%;
		height: 100%;
		margin-top: 16px;
		background-color: gray;

		border: 1px solid black;
	}

	top > stuff {
		border-color: red;
	}

	middle > stuff {
		border-color: purple;
		overflow: hidden;
	}

	bottom > stuff {
		border-color: blue;
	}

	.expand {
		height: 100%;
	}

	button {
		position: absolute;
		top: 4px;
		right: 8px;
	}
</style>
