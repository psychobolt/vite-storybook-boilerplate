import { mergeConfig, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonConfig from 'commons/esm/vite.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    plugins: [react()]
  })
);
