import { defineConfig, mergeConfig } from 'vitest/config';

import commonConfig from 'commons/esm/vitest.config.js';

export default defineConfig(
  mergeConfig(
    commonConfig,
    defineConfig({
      test: {
        coverage: {
          include: ['src/**/*.{ts,tsx}']
        },
        projects: ['.storybook/vitest.config.ts'],
        passWithNoTests: true
      }
    })
  )
);
