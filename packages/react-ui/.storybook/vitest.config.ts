import { mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/.storybook/vitest.config.js';

import viteConfig from './vite.config.ts';
import vitestConfig from '../vitest.config.ts';

export default mergeConfig(vitestConfig, mergeConfig(commonConfig, viteConfig));
