import { mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/vitest.config';

import storybookConfig from './.storybook/vitest.config';
import viteConfig from './vite.config';

export default mergeConfig(
  mergeConfig(commonConfig, viteConfig),
  storybookConfig
);
