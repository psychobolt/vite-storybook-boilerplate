import { join } from 'node:path';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin';

const configDir = join(process.cwd(), '.storybook');

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  plugins: [
    // The plugin will run tests for the stories defined in your Storybook config
    // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
    storybookTest({
      configDir,
      storybookUrl: process.env.SB_URL
    })
  ],
  test: {
    name: 'storybook',
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }]
    },
    coverage: {
      exclude: [
        '**/.storybook/**',
        // 👇 This pattern must align with the `stories` property of your `.storybook/main.ts` config
        '**/*.mdx',
        '**/*.@(story|stories).@(js|jsx|ts|tsx)',
        // 👇 This pattern must align with the output directory of `storybook build`
        '**/storybook-static/**'
      ]
    },
    setupFiles: [join(configDir, 'vitest.setup.ts')]
  }
});
