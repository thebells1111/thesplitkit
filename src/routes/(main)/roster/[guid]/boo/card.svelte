<script>
	import clone from 'just-clone';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { user, albyClientId } from '$/stores';

	export let block = {};
	export let showModal;
	export let activeBlock;
	export let banner = false;

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<div
	class="card"
	class:banner
	on:click={() => {
		if ($user.loggedIn) {
			showModal = true;
			activeBlock = clone(block);
		} else {
			goto(redirectUrl);
		}
	}}
>
	<album>
		<div class="artwork">
			<img src={block.image} alt={block.title} />
		</div>

		<img class="border" src="/boo-card.png" alt="cover art border" />
	</album>
</div>

<style>
	.card {
		display: inline-flex;
		flex-direction: column;
		margin: 8px;
		align-items: center;
		width: 200px;
		height: 220px;
		overflow: hidden;
	}

	album {
		display: inline-block;
		position: relative;
	}
	.border {
		width: 200px;
	}

	.artwork {
		width: 184px;
		height: 184px;
		overflow: hidden;
		position: absolute;
		top: 13px;
		left: 8px;
		z-index: 1;
	}

	.artwork > img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}

	.banner {
		width: 100%;
	}

	.banner .border {
		display: none;
	}

	.banner .artwork {
		width: initial;
		height: initial;
	}

	.banner .artwork > img {
		height: 200px;
		width: initial;
	}
</style>
