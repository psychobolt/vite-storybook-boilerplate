import { defineConfig } from 'vite';
import type { Meta } from '@storybook/web-components-vite';
import { vitePluginStorybookVariants } from 'commons/esm/.storybook/addons/addon-variants';

export default defineConfig({
  plugins: [vitePluginStorybookVariants<Meta>('lit')],
  css: {
    modules: {
      exportGlobals: true,
      localsConvention: 'camelCase'
    }
  }
});
