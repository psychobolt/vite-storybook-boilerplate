import { mergeConfig } from 'vitest/config';
import commonConfig from 'commons/esm/.storybook/vitest.config.js';

import viteConfig from './vite.config';
import vitestConfig from '../vitest.config';

export default mergeConfig(vitestConfig, mergeConfig(commonConfig, viteConfig));
