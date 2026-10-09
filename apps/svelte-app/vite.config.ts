import type { Adapter } from '@sveltejs/kit';
import { sveltekit } from '@sveltejs/kit/vite';
import cloudflare from '@sveltejs/adapter-cloudflare';
import vercel from '@sveltejs/adapter-vercel';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

import { readFileFromCwd } from 'commons/esm/bin/utils/functions.js';

const adapters: Record<string, () => Adapter> = {
	vercel,
	cloudflare
};
const port = process.env.PORT ? Number(process.env.PORT) : undefined;
const keyPath = process.env.HTTPS_KEY_PATH ?? '';
const certificatePath = process.env.HTTPS_CERT_PATH ?? '';

export default defineConfig({
	plugins: [sveltekit({ adapter: adapters[process.env.DEPLOY_TARGET ?? '']?.() })],
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	},
	server: {
		origin: process.env.APP_URL,
		port,
		...(keyPath || certificatePath
			? {
					https: {
						key: await readFileFromCwd(keyPath),
						cert: await readFileFromCwd(certificatePath)
					}
				}
			: {}),
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd()),
				...(process.env.YARN_GLOBAL_FOLDER ? [process.env.YARN_GLOBAL_FOLDER] : [])
			]
		}
	},
	preview: {
		port
	}
});
