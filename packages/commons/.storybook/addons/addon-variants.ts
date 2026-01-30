import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
// import { pathToFileURL } from 'node:url';
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
  meta: VariantsMeta<TArgs>;
  stories:
    | Array<VariantStory<TArgs>>
    | ((stories?: Array<VariantStoryObj<TArgs>>) => Array<VariantStory<TArgs>>);
}

type TemplateOptions<TArgs> = VariantsMeta<TArgs> & {
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
      return ({ importName, fileName, stories }: TemplateOptions<TMeta>) => `
        import { html } from "lit";
        import { ${importName} } from "${fileName}";

        const { importName: _meta0, fileName: _meta1, stories: _meta2, ..._meta3 } = meta;

        export default {
          render: ${importName},
          ..._meta3,
        };

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

let fileMatcher: RegExp = /\.variants?\.[jt]sx?$/;

const getImportPath = (filePath: string) => require.resolve(filePath);
// `${pathToFileURL(require.resolve(filePath))}`;

export function storybookVariantsIndexer<TArgs>(test = fileMatcher): Indexer {
  fileMatcher = test;
  return {
    test,
    async createIndex(fileName) {
      try {
        const { meta, stories }: VariantModule<TArgs> = await import(
          getImportPath(fileName)
        );
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

      const { meta, stories }: VariantModule<TArgs> = await import(
        getImportPath(id)
      );
      return `
        ${readFileSync(require.resolve(id), 'utf-8')}

        ${template({
          ...meta,
          stories: _.isFunction(stories) ? stories() : stories
        })};
      `;
    }
  };
}
