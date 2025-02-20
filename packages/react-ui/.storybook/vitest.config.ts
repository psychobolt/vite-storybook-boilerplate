import { mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/.storybook/vitest.config.js';

import viteConfig from './vite.config';

export default mergeConfig(
  commonConfig,
  viteConfig
);