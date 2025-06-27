import { defineConfig } from 'eslint/config';
import commonConfig from 'commons/esm/eslint.config';

export default defineConfig(...commonConfig, {
  ignores: ['apps/', 'packages/']
});
