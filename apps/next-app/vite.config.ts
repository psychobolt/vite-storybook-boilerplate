import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';

const deploymentPlugins: Record<string, PluginOption[]> = {
  cloudflare: [vinext(), cloudflare()]
};

export default defineConfig(() => ({
  plugins: deploymentPlugins[process.env.DEPLOY_TARGET ?? 'cloudflare'] ?? [],
  // Keep workspace portals in this project's node_modules resolution context.
  resolve: { preserveSymlinks: true, tsconfigPaths: false },
  // The existing Next build continues to own .next/.
  build: { outDir: 'dist' }
}));
