# Storybook Plugins

## Vite

### Variants

This plugin will allow variant story generation from a `enum` of values.

```ts
// Setup for .storybook/main.ts
import type { Meta } from "@storybook/web-components";
import {
  vitePLuginStorybookVariants,
  storybookVariantsIndexer,
} from "commons/plugins/storybook/vitePluginStorybookVariants.ts";

export default {
  // ...
  experimental_indexers: (existingIndexers) => [
    ...existingIndexers,
    storybookVariantsIndexer<Meta>(), // you can pass a custom regex e.g. /.variantstories.tsx?$/
  ],
  viteFinal: (config, options) =>
    mergeConfig(
      commonConfig.viteFinal(config, options),
      defineConfig({
        plugins: [vitePluginStorybookVariants<Meta>("lit")], // frameworks: "lit"
      }),
    ),
};
```

```ts
// MyComponent.variants.ts
import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/plugins/storybook/vite-plugin-storybook-variants.ts";
import { type VariantStoryObj, generateStories } from "commons/.storybook/utils.ts";

import type { Props } from "./MyComponent.ts";

export const meta = {
  title: "Components/MyComponent", // required
  fileName: "./MyComponent.ts", // required
  importName: "MyComponent", // required
  // ...
} satisfies VariantMeta<Props>;

type Story = StoryObj<Props> & VariantStoryObj<Props>;

export const MyComponent: Story = {
  name: "My Component (Default)", // required
  // ...
}

export const MyComponentDisabled: Story {
  name: "My Component (Disabled)" // required
  args: {
    disabled: true
  }
}

export const SizeEnum {
  small,
  medium,
  large
}

export const getStories = () => generateStories<Props, typeof SizeEnum>( // required
  [MyComponent, MyComponentDisabled],
  "size", // prop name
  SizeEnum
);

/**
 * vite plugin will generate Component Story Format e.g.
 *
 * export default {
 *  render: MyComponent
 *  // ...serializable meta data
 * };
 *
 * export const my_component_default_small = {
 *   name: "My Component (Default) - Small",
 *   args: {
 *     ...MyComponent.args
 *     size: "small"
 *   }
 * };
**/
```

> \*`default` export is not allowed for variant files

> \*Direct imports to component files should be avoided (except for types)

> `meta` and `args` props are serialized to JSON, so please be careful of non-JSON types
