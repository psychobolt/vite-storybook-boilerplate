import { readFileSync } from 'node:fs';
import { createRequire, registerHooks } from 'node:module';
import path from 'node:path';
import {
  type ComponentAnnotations,
  type StoryAnnotations,
  type Renderer,
  type Meta,
  type Args,
  isMeta
} from 'storybook/internal/csf';
import type { Indexer } from 'storybook/internal/types';
import type { PluginOption } from 'vite';
import _ from 'lodash';

import type { VariantStoryObj } from '../utils/story-generators.js';

const require = createRequire(import.meta.url);

export type VariantsMeta<TRenderer extends Renderer = Renderer> =
  | ComponentAnnotations<TRenderer>
  | Meta<TRenderer>;

export type VariantStory<TArgs = Args> = StoryAnnotations<Renderer, TArgs> & {
  exportName: string;
};

export interface VariantModule {
  default: VariantsMeta;
  stories:
    | Array<VariantStory>
    | ((stories?: Array<VariantStoryObj>) => Array<VariantStory>);
}

type TemplateOptions = {
  stories: Array<VariantStory>;
};

type Template = (options: TemplateOptions) => string;

const getSourceTemplate = (meta: VariantsMeta): Template => {
  const csfVersion = isMeta(meta) ? 4 : 3;
  return ({ stories }: TemplateOptions) => `
    ${stories.reduce((prev, { name, args, exportName }) => {
      let result = `${prev}\n`;
      switch (csfVersion) {
        case 4:
          result += `
              export const ${exportName} = meta.story({
                name: '${name}',
                args: ${JSON.stringify(args)}
              });
            `;
          break;
        default:
          result += `
              export const ${exportName} = {
                name: '${name}',
                args: ${JSON.stringify(args)}
              };
            `;
          break;
      }
      return result;
    }, '')}
  `;
};

//https://github.com/vitejs/vite/blob/v7.3.1/packages/vite/src/node/constants.ts#L108
export const CSS_LANGS_RE: RegExp =
  /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/;

// Reference: https://github.com/vitejs/vite/blob/v7.3.1/packages/vite/src/node/constants.ts#L145
const KNOWN_ASSET_TYPES = [
  'apng',
  'bmp',
  'png',
  'jpe?g',
  'jfif',
  'pjpeg',
  'pjp',
  'gif',
  'svg',
  'ico',
  'webp',
  'avif',
  'cur',
  'jxl',
  'mp4',
  'webm',
  'ogg',
  'mp3',
  'wav',
  'flac',
  'aac',
  'opus',
  'mov',
  'm4a',
  'vtt',
  'woff2?',
  'eot',
  'ttf',
  'otf',
  'webmanifest',
  'pdf',
  'txt'
];

const DEFAULT_ASSETS_RE = new RegExp(
  `\\.(` + KNOWN_ASSET_TYPES.join('|') + `)(\\?.*)?$`,
  'i'
);
const STORYBOOK_PREVIEW_RE = /\.storybook\/preview(\.[cm]?[tj]s|[tj]sx)?$/;

const importModule = (fileName: string) => {
  const hook = registerHooks({
    resolve(specifier, context, nextResolve) {
      const parentURL = context.parentURL ?? fileName;
      if (STORYBOOK_PREVIEW_RE.test(specifier)) {
        return {
          format: 'module',
          shortCircuit: true,
          url: require.resolve('../mock-api.js')
        };
      } else if (
        CSS_LANGS_RE.test(specifier) ||
        DEFAULT_ASSETS_RE.test(specifier)
      ) {
        return {
          format: 'mockAsset',
          shortCircuit: true,
          url: path.join(parentURL, '..', specifier)
        };
      }
      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (context.format === 'mockAsset') {
        return {
          format: 'module',
          shortCircuit: true,
          source: ''
        };
      }
      return nextLoad(url, context);
    }
  });

  delete require.cache[fileName];
  const exports = require(fileName);
  hook.deregister();
  return exports;
};

const fileMatcher: RegExp = /\.variants?\.[jt]sx?$/;

export const storybookVariantsIndexer: () => Indexer = () => ({
  test: fileMatcher,
  async createIndex(fileName) {
    try {
      delete require.cache[fileName];
      const { default: meta, stories }: VariantModule = importModule(fileName);
      const { title, tags: metaTags = [] } = isMeta(meta) ? meta.input : meta;

      return (_.isFunction(stories) ? stories() : stories).map(
        ({ name, exportName, tags = [] }) => ({
          type: 'story',
          title,
          tags: Array.from(new Set([...metaTags, ...tags])),
          metaTags,
          name,
          exportName,
          importPath: fileName
        })
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  }
});

export function vitePluginStorybookVariants(): PluginOption {
  return {
    name: 'vite-plugin-storybook-variants',
    async load(id) {
      if (!fileMatcher.test(id)) return;

      const fileName = require.resolve(id);
      const { default: meta, stories }: VariantModule = importModule(fileName);

      const template = getSourceTemplate(meta);

      return `
        ${readFileSync(fileName, 'utf-8')}

        ${template({
          stories: _.isFunction(stories) ? stories() : stories
        })};
      `;
    }
  };
}
