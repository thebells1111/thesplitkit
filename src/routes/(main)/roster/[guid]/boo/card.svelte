<script>
	import clone from 'just-clone';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { user, albyClientId } from '$/stores';

	export let block = {};
	export let showModal;
	export let activeBlock;

	let redirectUrl = `https://getalby.com/oauth?client_id=${albyClientId}`;
	redirectUrl += `&response_type=code&redirect_uri=${$page.url.href}`;
	redirectUrl += `&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<div
	class="card"
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
		align-items: center;
		overflow: hidden;
		cursor: pointer;
	}

	album {
		display: inline-block;
		position: relative;
		width: clamp(120px, 200px, calc(0.2 * 100vw));
		height: clamp(120px, 200px, calc(0.2 * 100vw));
		margin: 8px;
	}
	.border {
		width: 100%;
	}

	.artwork {
		width: calc(0.93 * 100%);
		height: calc(0.93 * 100%);
		overflow: hidden;
		position: absolute;
		top: calc(6.5%);
		left: calc(4%);
		z-index: 1;
		border-radius: 5px;
	}

	.artwork > img {
		object-fit: cover;
		height: 100%;
		width: 100%;
	}
</style>
