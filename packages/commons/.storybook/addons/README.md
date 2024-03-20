# Storybook Addons

Storybook addons not associated to the [official addon registry](https://storybook.js.org/docs/addons/writing-addons). Any addons listed here are experiemental and are queued for future migrations:

- [addon-variants](#variants)
- More coming soon!

## Variants

This addon will allow variant story generation from a `enum` of values.

```ts
// Setup for .storybook/main.ts
import type { Meta } from "@storybook/web-components";
import { mergeConfig, defineConfig } from "vite";
import {
  vitePluginStorybookVariants,
  storybookVariantsIndexer,
} from "commons/esm/.storybook/addons/addon-variants.js";

export default {
  // ...
  stories: [
    // ...
    "@(src|stories)/**/*.variant{s,}.@(js|jsx|ts|tsx)", // include
  ],
  experimental_indexers: (existingIndexers) => [
    ...existingIndexers,
    storybookVariantsIndexer<Meta>(), // you can pass a custom regex e.g. /.variantstories.[jt]sx?$/
  ],
  viteFinal: (config, options) =>
    mergeConfig(
      config,
      defineConfig({
        plugins: [vitePluginStorybookVariants<Meta>("lit")], // frameworks: "lit"
      }),
    ),
};
```

```ts
// MyComponent.variants.ts
import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/esm/.storybook/addons/vite-plugin-storybook-variants.js";
import { type VariantStoryObj, generateStories } from "commons/esm/.storybook/utils.js";

import type { Props } from "./MyComponent.ts";

export const meta = {
  title: "Components/MyComponent", // required
  fileName: "./MyComponent.ts", // required
  importName: "MyComponent", // required
  // ...
} satisfies VariantMeta<Props>;

type Story = StoryObj<typeof Props> & VariantStoryObj<Props>;

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

#### Limitations

- `default` export is not allowed for variant files
- Direct imports to component files should be avoided (except for type references)
- `meta` and `args` props are serialized to JSON, so please be careful of non-JSON types
- You must run `test-runner` with [Index.json mode](https://storybook.js.org/docs/writing-tests/test-runner#indexjson-mode). See related [issue](https://github.com/storybookjs/test-runner/issues/262)
