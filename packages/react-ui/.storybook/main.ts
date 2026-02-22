import { createRequire } from 'node:module';
import { defineMain } from '@storybook/react-vite/node';
import commonConfig, {
  getAbsolutePath
} from 'commons/esm/.storybook/vite-main.js';

const require = createRequire(import.meta.url);

export default defineMain({
  ...commonConfig,
  addons: [
    ...commonConfig.addons,
    getAbsolutePath('@storybook/addon-vitest', require)
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite', require),
    options: {}
  }
});
