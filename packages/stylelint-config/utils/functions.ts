import { createRequire } from 'node:module';
import path from 'node:path';
import type { Plugin } from 'stylelint';

export const require = createRequire(
  process.env.INIT_CWD
    ? import.meta.url
    : path.join(process.cwd(), 'packages/unplugged/node_modules')
);

export const resolvePlugins = (plugins: Array<string | Plugin>) => 
  plugins.map(plugin => typeof plugin === 'string' ? require.resolve(plugin) : plugin);

