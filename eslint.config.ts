import { defineConfig, globalIgnores } from 'eslint/config';
import commonConfig from 'commons/esm/eslint.config.js';

export default defineConfig(
  commonConfig,
  globalIgnores(['apps/', 'packages/'])
);
