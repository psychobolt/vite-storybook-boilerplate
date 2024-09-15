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
    pattern: /^.+[/\\].+[/\\](.+)\.module\.scss$/,
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
const assets = ['src/style.scss', ...globSync('src/*/*.module.scss')];

interface AssetConfig {
  input: Record<string, string>;
  assetFileNames: Record<string, string>;
}

const { input, assetFileNames }: AssetConfig = assets.reduce(
  (rest, file) => {
    const assetFileName = getAssetFileName(file);
    return {
      input: {
        ...rest.input,
        [assetFileName]: file
      },
      assetFileNames: {
        ...rest.assetFileNames,
        [file]: assetFileName
      }
    };
  },
  { input: {}, assetFileNames: {} }
);

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
        input,
        preserveEntrySignatures: 'strict',
        output: {
          entryFileNames: 'index.js', // disabling JS output is unsupported, use noEmit()
          assetFileNames: ({ originalFileName }) =>
            assetFileNames[originalFileName ?? ''] ??
            'assets/[name]-[hash][extname]'
        }
      },
      cssCodeSplit: true
    }
  }),
  false
);
