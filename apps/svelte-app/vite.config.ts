import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	},
	server: {
		fs: {
			allow: ['../../.yarn']
		}
	}
});
