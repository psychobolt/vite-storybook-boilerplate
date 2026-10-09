import { cloudflare } from '@cloudflare/vite-plugin';
import { nitro } from 'nitro/vite';
import vinext from 'vinext';
import { defineConfig, type PluginOption } from 'vite';

const deploymentPlugins: Record<string, PluginOption[]> = {
  cloudflare: [vinext(), cloudflare()],
  standalone: [vinext(), nitro()]
};

export default defineConfig({
  plugins:
    deploymentPlugins[process.env.DEPLOY_TARGET ?? ''] ??
    deploymentPlugins.standalone,
  // Keep workspace portals in this project's node_modules resolution context.
  resolve: { preserveSymlinks: true, tsconfigPaths: false },
  // The existing Next build continues to own .next/.
  build: { outDir: 'dist' }
});
