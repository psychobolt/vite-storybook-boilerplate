import { createRequire } from 'node:module';
import { defineConfig, mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/vitest.config';

import viteConfig from './vite.config';

const require = createRequire(import.meta.url);

export default mergeConfig(
  mergeConfig(commonConfig, viteConfig),
  defineConfig({
    test: {
      workspace: [
        '.storybook/vitest.config.ts',
        {
          extends: true,
          test: {
            name: 'react (jsdom)',
            environment: 'jsdom',
            setupFiles: [require.resolve('commons/esm/vitest.setup')]
          }
        }
      ]
    }
  })
);
