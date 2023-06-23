<div class="loading">
	<div class="ripple1" />
	<div class="ripple2" />
	<div class="ripple3" />
</div>

<style>
	@keyframes ripple {
		0% {
			transform: scale(0);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		position: relative;
	}

	.ripple1,
	.ripple2,
	.ripple3 {
		position: absolute;
		width: 100%;
		height: 100%;
		border: 5px solid #000000;
		border-radius: 50%;
		background: transparent;
		opacity: 1;
	}
	.ripple1 {
		animation: ripple 1s linear infinite;
	}

	.ripple2 {
		animation: ripple 1s linear infinite 0.33s; /* 1s delay */
	}

	.ripple3 {
		animation: ripple 1s linear infinite 0.66s; /* 2s delay */
	}
</style>
