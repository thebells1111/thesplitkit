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

<div>
	{block.title || ''}

	<button
		class="boost"
		on:click={() => {
			if ($user.loggedIn) {
				showModal = true;
				activeBlock = clone(block);
			} else {
				goto(redirectUrl);
			}
		}}>Boost 🚀</button
	>
</div>
