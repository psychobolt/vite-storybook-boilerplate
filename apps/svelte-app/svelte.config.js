import { createRequire } from 'node:module';
import util from 'node:util';
import adapter from '@sveltejs/adapter-auto';

const require = createRequire(import.meta.url);

if (!util.styleText) {
	util.styleText = (color, text) => {
		const colorize = require('kleur')(color);
		return colorize(text);
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	async preprocess(opts) {
		const { vitePreprocess } = await import('@sveltejs/vite-plugin-svelte');
		vitePreprocess(opts);
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
