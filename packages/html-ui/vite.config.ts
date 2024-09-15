import { globSync } from 'glob';
import { defineConfig, mergeConfig } from 'vite';
import sassGlobImport from 'vite-plugin-sass-glob-import';
import noEmit from 'rollup-plugin-no-emit';
import commonConfig from 'commons/esm/vite.config';

interface Module {
  pattern: RegExp;
  ext: string;
}

const modules: Module[] = [
  {
    pattern: /src[/\\](style)\.scss$/,
    ext: 'css'
  },
  {
    pattern: /^.+[/\\]+.+[/\\]+(.+)\.module\.scss$/,
    ext: 'css'
  }
];

const srcPattern = /^(.*src)[/\\]/;

function getAssetFileName(moduleId: string) {
  if (moduleId) {
    for (const { pattern, ext } of modules) {
      if (!pattern.test(moduleId)) continue;
      const [, name] = moduleId.match(pattern) ?? [];
      if (name) return `${name}.${ext}`;
    }
  }
  return moduleId.replace(srcPattern, '');
}

const mainEntryJs = /^index.+\.js(?:\.map)?/;

export default mergeConfig(
  commonConfig,
  defineConfig({
    plugins: [
      sassGlobImport(),
      noEmit({ match: (file) => mainEntryJs.test(file) })
    ],
    css: {
      modules: {
        scopeBehaviour: 'global'
      }
    },
    build: {
      lib: false,
      rollupOptions: {
        input: ['src/style.scss', ...globSync('src/*/*.module.scss')].reduce(
          (rest, file) => {
            const assetFileName = getAssetFileName(file);
            return {
              ...rest,
              [assetFileName]: file
            };
          },
          {}
        ),
        preserveEntrySignatures: 'strict',
        output: {
          entryFileNames: 'index.js', // disabling JS output is unsupported, use noEmit()
          assetFileNames: ({ name }) =>
            name ? name : 'assets/[name]-[hash][extname]'
        }
      },
      cssCodeSplit: true
    }
  }),
  false
);
