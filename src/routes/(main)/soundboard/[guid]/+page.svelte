<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import io from 'socket.io-client';
	import PlayArrow from '$icons/PlayArrow.svelte';

	import { remoteServer, user } from '$/stores';

	let sounds = [''];

	let amounts = ['default', '3333'];

	let leaderBoardSocket;
	let debounceTimeout;
	let initialized = false;
	let userInteractionEnabled = false;
	let volume = 1;

	onMount(async () => {
		fetch(remoteServer + '/api/sk/getsounds?guid=' + $page.params.guid)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				if (data?.status === 'success') {
					sounds = data.sounds;
					amounts = data.amounts;
				}
			})
			.catch((error) => {
				console.error('Error:', error);
			});

		const url = remoteServer + '/leaderboard?event_id=' + $page.params.guid;
		leaderBoardSocket = io.connect(url, { withCredentials: true });

		leaderBoardSocket.on('testResponse', function (data) {
			let soundIndex = amounts.findIndex((value) => {
				return Number(value) === Number(data?.value_msat_total / 1000);
			});
			if (soundIndex === -1) {
				soundIndex = 0;
			}
			if (sounds[soundIndex]) {
				playSound(sounds[soundIndex]);
			}
		});
		leaderBoardSocket.on('tlv', function (data) {
			if (initialized) {
				let soundIndex = amounts.findIndex((value) => {
					return Number(value) === Number(data?.value_msat_total / 1000);
				});
				if (soundIndex === -1) {
					soundIndex = 0;
				}

				if (sounds[soundIndex]) {
					playSound(sounds[soundIndex]);
				}
			} else {
				initialized = true;
			}
		});
	});

	function sendTest() {
		console.log('sending test');
		leaderBoardSocket.emit('test', 'hello');
	}

	function playSound(src) {
		if (src) {
			let audio = new Audio(src);
			audio.volume = volume;
			audio.onended = function () {
				this.remove();
			};
			audio.play();
		}
	}

	function addSound() {
		sounds = [...sounds, ''];
		amounts = [...amounts, ''];
	}

	function saveSounds() {
		fetch(remoteServer + '/api/sk/savesounds', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ sounds, amounts, guid: $page.params.guid })
		})
			.then((response) => response.json())
			.then((newData) => {
				console.log(newData);
				if (newData.status !== 'success') {
					alert('You are no longer logged in, and your changes are not being saved.');
				}
			})
			.catch((error) => console.error(error));
	}

	function debounceSaveSounds() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(saveSounds, 1000);
	}

	function updateVolume(event) {
		volume = event.target.value;
		// Assuming players is an array of your audio players
		// players.forEach((player) => {
		// 	player.volume = volume;
		// });
	}
</script>

{#if $user?.loggedIn}
	{#if userInteractionEnabled}<soundboard>
			<!-- <button on:click={sendTest}>Test</button> -->
			<button on:click={addSound}>Add Sound</button>
			<div>
				<h4>Link to Audio File</h4>
				<h4>Boost Amount to Trigger Audio</h4>
			</div>
			<sounds>
				{#each sounds as sound, i}
					<div>
						<button class="play" on:click={playSound.bind(this, sound)}>
							<PlayArrow size={36} />
						</button>
						<input type="text" bind:value={sound} on:input={debounceSaveSounds} />
						<input
							type="text"
							bind:value={amounts[i]}
							disabled={i === 0}
							on:input={debounceSaveSounds}
						/>
					</div>
				{/each}
			</sounds>
			<h3>Volume</h3>
			<input type="range" min="0" max="1" step="0.01" bind:value={volume} on:input={updateVolume} />
		</soundboard>
	{:else}
		<interaction>
			<h2
				on:click={() => {
					userInteractionEnabled = true;
				}}
			>
				Click here to get started.
			</h2>
		</interaction>
	{/if}
{:else}
	<p>You must be logged in to view this page.</p>
{/if}

<style>
	button {
		margin: 8px auto;
		width: 240px;
	}

	div > input:nth-of-type(1) {
		flex-grow: 1;
		margin-right: 16px;
	}

	div {
		display: flex;
		justify-content: space-between;
		margin: 8px 16px;
	}

	h4 {
		margin: 0;
	}

	div > h4:nth-of-type(1) {
		margin-left: 50px;
	}

	div > h4:nth-of-type(2),
	div > input:nth-of-type(2) {
		min-width: 240px;
	}
	interaction {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	interaction > h2 {
		cursor: pointer;
		margin-bottom: 100px;
	}

	input[type='range'] {
		margin: 8px 8px 16px 8px;
	}

	h3 {
		text-align: center;
		margin: 16px 0 0 0;
	}

	.play {
		width: 40px;
		margin: 0 8px 0 0;
		padding: 0;
		background-color: transparent;
		box-shadow: none;
		color: black;
	}

	soundboard {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	sounds {
		flex-grow: 1;
		overflow: auto;
	}
</style>
