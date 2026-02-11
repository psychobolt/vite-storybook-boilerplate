import { readFileSync } from 'node:fs';
import { createRequire, registerHooks } from 'node:module';
import path from 'node:path';
import type {
  ComponentAnnotations,
  StoryAnnotations,
  Renderer,
  Indexer
} from 'storybook/internal/types';
import type { PluginOption } from 'vite';
import _ from 'lodash';

import type { VariantStoryObj } from '../utils/story-generators.js';

const require = createRequire(import.meta.url);

export interface VariantsMeta<
  TArgs,
  TRenderer extends Renderer = Renderer
> extends ComponentAnnotations<TRenderer, TArgs> {
  fileName: string;
  importName: string;
}

export type VariantStory<TArgs> = StoryAnnotations<Renderer, TArgs> & {
  exportName: string;
};

export interface VariantModule<TArgs> {
  default: VariantsMeta<TArgs>;
  stories:
    | Array<VariantStory<TArgs>>
    | ((stories?: Array<VariantStoryObj<TArgs>>) => Array<VariantStory<TArgs>>);
}

type TemplateOptions<TArgs> = {
  stories: Array<VariantStory<TArgs>>;
};

enum FrameworkEnum {
  lit
}

type Framework = keyof typeof FrameworkEnum;

function getSourceTemplate<TMeta>(framework: Framework) {
  const frameworkVal = framework ? FrameworkEnum[framework] : null;
  switch (frameworkVal) {
    case FrameworkEnum.lit:
      return ({ stories }: TemplateOptions<TMeta>) => `
        ${stories.reduce(
          (prev, { name, args, exportName }) => `
          ${prev}
          export const ${exportName} = {
            name: "${name}",
            args: ${JSON.stringify(args)}
          };
        `,
          ''
        )}
      `;
  }
}

const ASSETS_REGEX = /\.scss$/;

const importModule = (moduleId: string) => {
  const hook = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (ASSETS_REGEX.test(specifier)) {
        return {
          format: 'mockAsset',
          shortCircuit: true,
          url: path.join(context.parentURL ?? moduleId, '..', specifier)
        };
      }
      return nextResolve(specifier);
    },
    load(url, context, nextLoad) {
      if (context.format === 'mockAsset') {
        return {
          format: 'module',
          shortCircuit: true,
          source: 'export default "";'
        };
      }
      return nextLoad(url, context);
    }
  });
  const exports = require(moduleId);
  hook.deregister();
  return exports;
};

let fileMatcher: RegExp = /\.variants?\.[jt]sx?$/;

export function storybookVariantsIndexer<TArgs>(test = fileMatcher): Indexer {
  fileMatcher = test;
  return {
    test,
    async createIndex(fileName) {
      try {
        const moduleId = require.resolve(fileName);

        delete require.cache[moduleId];
        const { default: meta, stories }: VariantModule<TArgs> =
          importModule(moduleId);
        const { title, tags: metaTags = [] } = meta;

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
  };
}

export function vitePluginStorybookVariants<TArgs>(
  framework: Framework
): PluginOption {
  const template = getSourceTemplate<TArgs>(framework);
  if (!template) {
    return;
  }
  return {
    name: 'vite-plugin-storybook-variants',
    async load(id) {
      if (!fileMatcher.test(id)) {
        return;
      }

      const moduleId = require.resolve(id);

      delete require.cache[moduleId];
      const { stories }: VariantModule<TArgs> = importModule(moduleId);

      return `
        ${readFileSync(moduleId, 'utf-8')}

        ${template({
          stories: _.isFunction(stories) ? stories() : stories
        })};
      `;
    }
  };
}
