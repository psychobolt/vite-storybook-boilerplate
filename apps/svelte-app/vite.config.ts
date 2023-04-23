import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
	  modules: {
		localsConvention: 'camelCase',
	  },
	},
	resolve: {
		alias: {
			'html-ui': '../../packages/html-ui/dist/'
		}
	}
});
