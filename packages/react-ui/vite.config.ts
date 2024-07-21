import { defineConfig, mergeConfig } from 'vite';
import commonConfig from 'commons/esm/vite.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    },
    build: {
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['react', 'react-dom'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      }
    }
  }),
  false
);
