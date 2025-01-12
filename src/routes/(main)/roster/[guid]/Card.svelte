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
	on:click={() => {
		if ($user.loggedIn) {
			showModal = true;
			activeBlock = clone(block);
		} else {
			goto(redirectUrl);
		}
	}}
>
	<img src={block.image} alt={block.title} />
	<p>{block.title || ''}</p>
</div>

<style>
	div {
		display: inline-flex;
		flex-direction: column;
		margin: 8px;
		align-items: center;
		width: 100px;
		height: 180px;
		overflow: hidden;
	}
	p {
		margin: 4px 0;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	img {
		width: 100px;
		border-radius: 50%;
	}
</style>
