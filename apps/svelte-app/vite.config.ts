import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

const port = Number(process.env.PORT ?? 5173);
const appUrl = process.env.APP_URL ?? `https://localhost:${port}`;
const certificatePath = resolve(
	process.cwd(),
	process.env.HTTPS_CERT_PATH ?? '../../cert/dev-cert.pem'
);
const keyPath = resolve(process.cwd(), process.env.HTTPS_KEY_PATH ?? '../../cert/dev-key.pem');

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		modules: {
			localsConvention: 'camelCase'
		}
	},
	server: {
		origin: appUrl,
		port,
		https: {
			key: readFileSync(keyPath),
			cert: readFileSync(certificatePath)
		},
		fs: {
			allow: [
				searchForWorkspaceRoot(process.cwd()),
				process.env.YARN_GLOBAL_FOLDER ?? resolve('../../.temp/.yarn')
			]
		}
	},
	preview: {
		port
	}
});
