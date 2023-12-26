import { writable } from 'svelte/store';
import { dev } from '$app/environment';

export const remoteServer = dev ? 'http://localhost:8000' : 'https://api.thesplitkit.com';
export const hostUrl = dev ? 'http://localhost:3000' : 'https://www.thesplitkit.com';
export const albyClientId = dev ? '32dVOIuGiA' : 'GshATUDCSc';
export const albyReady = writable(false);
export const events = writable([]);

export const user = writable({ loggedIn: false });
export const catalog = writable([]);

export const liveBlocks = writable([]);
export const mainSettings = writable({ splits: 95, broadcastMode: 'edit', editEnclosure: '' });
export const defaultBlockGuid = writable();
export const activePageGuid = writable();
export const activeBroadcastGuid = writable();
export const socket = writable();
export const loaded = writable(false);

export const liveMode = writable();
export const liveEnclosure = writable();

export const copiedBlock = writable();
export const blocksList = writable();
export const changeDefault = writable(false);

export const feedShowNotes = writable(''); //this is because of weirdness with TinyMCE and using item.description
