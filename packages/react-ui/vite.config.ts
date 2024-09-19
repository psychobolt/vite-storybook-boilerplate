import { globSync } from 'glob';
import { defineConfig, mergeConfig } from 'vite';
import commonConfig, {
  type ModulePattern,
  srcPattern,
  getInputMap
} from 'commons/esm/vite.config';

const extPattern = /\.tsx?$/;
const patterns: ModulePattern[] = [
  {
    pattern: /^src[/\\](index)\.ts/
  },
  {
    pattern: /^src[/\\](.+[/\\].+)\.tsx?/
  }
];

export default mergeConfig(
  commonConfig,
  defineConfig({
    css: {
      modules: {
        localsConvention: 'camelCase'
      }
    },
    build: {
      lib: {
        entry: getInputMap(patterns, [
          'src/index.ts',
          ...globSync('src/**/*[!@(.story|.stories)].{ts,tsx}')
        ])
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ['react', 'react/jsx-runtime', 'react-dom', 'html-ui'],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
          // chunkFileNames: '[name]', // name is handled in manualChunks
          manualChunks(id) {
            if (!srcPattern.test(id)) return 'vendor';
            return id.replace(srcPattern, '').replace(extPattern, '');
          }
        }
      }
    }
  }),
  false
);
