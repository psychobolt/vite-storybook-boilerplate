import { defineConfig } from 'eslint/config';
import { mainDir } from 'commons/esm/.storybook/vite-main.js';
import storybookConfig from 'commons/esm/.storybook/eslint-config.js';

const variantFiles = `${mainDir}/**/*.variant{s,}.@(js|jsx|ts|tsx)`;

const config: ReturnType<typeof defineConfig> = defineConfig(
  storybookConfig.map((config) => {
    switch (config.name) {
      case 'storybook:recommended:stories-rules':
        return {
          ...config,
          files: [
            `${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`,
            variantFiles
          ]
        };
      default:
        return config;
    }
  }),
  {
    files: [variantFiles],
    rules: {
      'storybook/default-exports': 0,
      'storybook/prefer-pascal-case': 0
    }
  }
);

export default config;
