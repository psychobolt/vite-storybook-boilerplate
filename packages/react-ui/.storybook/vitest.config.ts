import { defineConfig, mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/.storybook/vitest.config.js';

import viteConfig from '../vite.config.ts';

export default defineConfig((env) =>
  mergeConfig(commonConfig, viteConfig(env))
);
