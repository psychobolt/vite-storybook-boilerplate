import { readFileSync } from "fs";
import type { ComponentAnnotations, Renderer, Indexer } from "@storybook/types";
import type { PluginOption } from "vite";
import _ from "lodash";
import type { VariantStoryObj } from "../utils.ts";

export type VariantsMeta<TArgs> = ComponentAnnotations<Renderer, TArgs> & {
  fileName: string;
  importName: string;
};

export interface VariantStory<TArgs> {
  name: string;
  args: Partial<TArgs>;
  exportName: string;
}

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
  lit,
}

type Framework = keyof typeof FrameworkEnum;

function getSourceTemplate<TMeta>(framework: Framework) {
  const frameworkVal = framework ? FrameworkEnum[framework] : null;
  switch (frameworkVal) {
    case FrameworkEnum.lit:
      return ({
        importName,
        fileName,
        stories,
        ...rest
      }: TemplateOptions<TMeta>) => `
        import { html } from "lit";
        import { ${importName} } from "${fileName}";

        export default {
          render: ${importName},
          ${JSON.stringify(rest).slice(1, -1)}
        };

        ${stories.reduce(
          (prev, { name, args, exportName }) => `
          ${prev}
          export const ${exportName} = {
            name: "${name}",
            args: ${JSON.stringify(args)}
          };
        `,
          "",
        )}
      `;
  }
}

let fileMatcher: RegExp = /\.variants?\.tsx?$/;

export function storybookVariantsIndexer<TArgs>(test = fileMatcher): Indexer {
  fileMatcher = test;
  return {
    test,
    async createIndex(fileName) {
      try {
        const { meta, stories }: VariantModule<TArgs> = await import(
          `${fileName}?${new Date().getTime()}`
        );
        const { title, tags } = meta;

        return (_.isFunction(stories) ? stories() : stories).map(
          ({ name, exportName }) => ({
            type: "story",
            title,
            tags,
            name,
            exportName,
            importPath: fileName,
          }),
        );
      } catch (e) {
        console.error(e);
        return [];
      }
    },
  };
}

export function vitePluginStorybookVariants<TArgs>(
  framework: Framework,
): PluginOption {
  const template = getSourceTemplate<TArgs>(framework);
  if (!template) {
    return;
  }
  return {
    name: "vite-plugin-storybook-variants",
    async load(id) {
      if (!fileMatcher.test(id)) {
        return;
      }

      const { meta, stories }: VariantModule<TArgs> = await import(
        `${id}?${new Date().getTime()}`
      );
      return `
        ${readFileSync(require.resolve(id), "utf-8")}

        ${template({
          ...meta,
          stories: _.isFunction(stories) ? stories() : stories,
        })};
      `;
    },
  };
}
