<script>
	import clone from 'just-clone';

	import { page } from '$app/stores';

	import { user, albyClientId } from '$/stores';

	export let block = {};
	export let showModal;
	export let activeBlock;
	export let imgSrc = '';
	export let paymentType;

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<div
	class="card"
	on:click={() => {
		showModal = true;
		activeBlock = clone(block);
	}}
>
	<!-- <album>
		<div class="artwork">
			<img src={block.image} alt={block.title} />
		</div>

		<img class="border" src="/boo-card3.png" alt="cover art border" />
	</album> -->

	<img src={imgSrc || block.image} alt={block.title} />
</div>

<style>
	.card {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		cursor: pointer;
		margin: 0 8px;
		align-items: center;
		justify-content: center;
		max-width: 160px;
	}

	album {
		display: inline-block;
		position: relative;
	}
	.border {
		width: 100%;
	}

	.artwork {
		width: 97.5%;
		height: 90%;
		overflow: hidden;
		position: absolute;
		top: 6.5%;
		left: 1.25%;
		z-index: 1;
		border-radius: 0 0 3px 3px;
		object-fit: cover;
		/* height: 90%;
		width: 90%;
		position: relative;
		top: 0px;
		left: 8px; */
	}

	.artwork > img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}

	.card {
		position: relative;
	}

	.card > img {
		object-fit: cover;
		height: 100%;
		width: 100%;
		position: relative;
		left: 7.5%;
		/* filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5)); */
	}
</style>
