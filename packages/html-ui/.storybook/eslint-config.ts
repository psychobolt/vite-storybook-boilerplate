import { defineConfig } from 'eslint/config';
import { stories } from 'commons/esm/.storybook/vite-main.js';
import storybookConfig from 'commons/esm/.storybook/eslint-config.js';

const config: ReturnType<typeof defineConfig> = defineConfig(
  storybookConfig.map((config) => {
    switch (config.name) {
      case 'storybook:recommended:stories-rules':
        return {
          ...config,
          files: stories
        };
      default:
        return config;
    }
  }),
  {
    rules: {
      'storybook/prefer-pascal-case': 0
    }
  }
);

export default config;
