import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			// these are the aliases and paths to them
			$functions: path.resolve('src', 'lib', 'functions'),
			$: path.resolve('src'),
			$icons: path.resolve('src', 'lib', 'icons')
		}
	}
});
