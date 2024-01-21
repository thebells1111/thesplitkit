<script>
	import { page } from '$app/stores';
	import { albyClientId } from '$/stores';

	let redirect_uri = $page.url.href;

	const code = $page.url.searchParams.get('code');
	if (code) {
		redirect_uri = redirect_uri.split($page.url.search)[0];
	}

	redirect_uri = redirect_uri.slice(0, -1);

	const redirectUrl =
		`https://getalby.com/oauth?client_id=${albyClientId}&response_type=code&redirect_uri=` +
		redirect_uri +
		`&scope=account:read%20balance:read%20payments:send%20invoices:read`;
</script>

<section class="intro">
	<div class="container">
		<header>
			<img src="/splitB300.png" />
			<header-text>
				<h2>Empower Your Projects with Lightning Network Boostagrams</h2>
				<paragraphs>
					<p>
						<mobile-bold>Welcome to The Split Kit</mobile-bold>, the innovative app that harnesses
						the power of the Lightning Network to boost your project and reward your team in the
						process. With The Split Kit, you can create a unique and engaging promotions page for
						your podcast, album, or event, while also enabling fans and supporters to send
						Boostagrams – a combination of messages and Lightning Network payments – to show their
						appreciation.
					</p>
					<p>
						<a href="/login"> Log In </a>
						to view your <a href="/events">Events</a> to get started today and elevate your project to
						new heights with The Split Kit!
					</p>
				</paragraphs>
			</header-text>
		</header>
		<h3>How does The Split Kit work?</h3>
		<ol>
			<li>
				<strong>Build Value Blocks:</strong> The Split Kit allows you to create value blocks consisting
				of various Lightning Addresses. These addresses represent the key contributors and collaborators
				who bring value to your project, such as artists, developers, or marketers.
			</li>
			<li>
				<strong>Design Your Promotions Page:</strong> Customize your promotions page by uploading an
				eye-catching image,a link, and the value block you've created. This page will showcase the key
				elements of your promotion, enticing visitors to learn more and support your cause.
			</li>
			<li>
				<strong>Generate QR Codes and Links:</strong> Once your promotions page is ready, The Split Kit
				will generate a QR code and a link that can be easily shared on your website, social media, or
				any promotional materials.
			</li>
			<li>
				<strong>Boostagram Integration:</strong> When a supporter scans the QR code or clicks the link,
				they will be directed to your promotions page, where they can send a Boostagram. A Boostagram
				is a combination of a personal message and a payment made via the Lightning Network.
			</li>
			<li>
				<strong>Reward Your Team:</strong> The payment attached to each Boostagram is automatically split
				among the Lightning Addresses in the value block, based on the predetermined split amount. This
				ensures that everyone who has contributed to the project receives their fair share of the support.
				To help maintain The Split Kit, a 5% split is added to each transaction.
			</li>
		</ol>
	</div>
</section>

<!-- CSS styles -->
<style>
	section {
		overflow: auto;
	}
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 15px;
	}

	header {
		display: flex;
	}

	ol {
		padding: 0 0 0 0.5em;
	}

	li {
		list-style: none;
		margin-bottom: 0.75em;
	}

	header-text {
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	header-text h2,
	header-text p {
		margin: 0 0 1rem 0;
	}

	.intro h2 {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.intro p {
		font-size: 1.1rem;
		margin-bottom: 1rem;
	}

	img {
		object-fit: contain;
	}

	a {
		font-size: 1.1em;
		font-weight: 600;
	}

	@media (max-width: 799px) {
		header {
			flex-direction: column;
		}

		img {
			width: 200px;
			margin: 0 auto;
		}

		header h2 {
			text-align: center;
		}

		header paragraphs {
			display: flex;
			flex-direction: column-reverse;
		}

		mobile-bold {
			font-weight: 600;
		}
	}
</style>
