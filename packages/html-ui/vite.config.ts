import { globSync } from "glob";
import type { CSSModulesOptions } from "vite";
import { defineConfig, mergeConfig } from "vite";
import commonConfig from "commons/esm/vite.config";

interface Module {
  entry: RegExp;
  assetName: RegExp;
  ext: string;
  assets: string[];
  index: number;
}

interface CSSModulesOptionsExtended extends CSSModulesOptions {
  exportGlobals: true;
}

const modules: Module[] = [
  {
    entry: /src[\/\\](style).scss$/,
    assetName: /^style.css$/,
    ext: "css",
    assets: [],
    index: -1,
  },
  {
    entry: /^.+[\/\\](.+)[\/\\]index.scss$/,
    assetName: /^index.css$/,
    ext: "css",
    assets: [],
    index: -1,
  },
];

function getAssetName({ entry, assetName, ext }: Module, moduleId: string) {
  const [, module] = moduleId.match(entry) ?? [];
  return `${module}.${ext}`;
}

function mapAssets(moduleId: string) {
  for (const module of modules) {
    if (!module.entry.test(moduleId)) continue;
    module.assets.push(getAssetName(module, moduleId));
    return;
  }
}

const ASSET_FILE_NAMES = "assets/[name]-[hash][extname]";

function shiftAssets(assetName: string) {
  for (const module of modules) {
    if (!module.assetName.test(assetName)) continue;
    ++module.index;
    if (module.index === module.assets.length) {
      module.index = 0;
    }
    return module.assets[module.index];
  }
  return ASSET_FILE_NAMES;
}

const cssModulesOption: CSSModulesOptionsExtended = {
  globalModulePaths: [/src/],
  exportGlobals: true,
  localsConvention: "camelCase",
};

export default mergeConfig(
  commonConfig,
  defineConfig({
    build: {
      lib: false,
      rollupOptions: {
        input: ["src/style.scss", ...globSync("src/*/index.scss")],
        output: {
          entryFileNames({ facadeModuleId }) {
            mapAssets(facadeModuleId as string);
            return "[name]";
          },
          assetFileNames({ name }) {
            const assetName = name as string;
            return shiftAssets(assetName);
          },
        },
      },
      cssCodeSplit: true,
    },
    css: {
      modules: cssModulesOption,
    },
  }),
  false,
);
