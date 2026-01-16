# Storybook Addons

Storybook addons not associated to the [official addon registry](https://storybook.js.org/docs/addons/writing-addons). Any addons listed here are experiemental and are queued for future migrations:

- [addon-variants](#variants)
- More coming soon!

## [Variants](addon-variants.ts)

This addon extends the [Component Story Format](https://github.com/ComponentDriven/csf), by collecting Story Variants from a array export ( `stories`). See [here](../utils/README.md#story-generators) for general utilities.

### Setup

```ts
// Setup for .storybook/main.ts
import type { Meta } from '@storybook/web-components-vite';
import { mergeConfig, defineConfig } from 'vite';
import {
  vitePluginStorybookVariants,
  storybookVariantsIndexer
} from 'commons/esm/.storybook/addons/addon-variants';

export default {
  // ...
  stories: [
    // ...
    '@(src|stories)/**/*.variant{s,}.@(js|jsx|ts|tsx)' // include
  ],
  experimental_indexers: (existingIndexers) => [
    ...existingIndexers,
    storybookVariantsIndexer<Meta>() // you can pass a custom regex e.g. /.variantstories.[jt]sx?$/
  ],
  viteFinal: (config, options) =>
    mergeConfig(
      config,
      defineConfig({
        plugins: [vitePluginStorybookVariants<Meta>('lit')] // frameworks: "lit"
      })
    )
};
```

#### ESLint Rules (Optional)

See main [docs](../../README.md#eslint-1) for more info.

```ts
import { defineConfig } from 'eslint/config';
import { mainDir } from 'commons/esm/.storybook/vite-main.js';
import storybookConfig from 'commons/esm/.storybook/eslint.config.js';

const variantFiles = `${mainDir}/**/*.variant{s,}.@(js|jsx|ts|tsx)`;

export default defineConfig(
  storybookConfig.map((config) => {
    switch (config.name) {
      case 'storybook:recommended:stories-rules':
        return {
          ...config,
          files: [
            `${mainDir}/**/*.@(story|stories).@(js|jsx|ts|tsx)`,
            variantFiles
          ]
        };
      default:
        return config;
    }
  }),
  {
    files: [variantFiles],
    rules: {
      'storybook/default-exports': 0,
      'storybook/prefer-pascal-case': 0
    }
  }
);
```

### Usage

```ts
// MyComponent.variants.ts
import type { StoryObj } from "@storybook/web-components";
import type { VariantsMeta } from "commons/esm/.storybook/addons/vite-plugin-storybook-variants.js";
import { type VariantStoryObj, generateStories } from "commons/esm/.storybook/utils/story-generators.js";

import type { Props } from "./MyComponent.ts";

export const meta = {
  title: "Components/MyComponent", // required
  fileName: "./MyComponent.ts", // required
  importName: "MyComponent", // required
  // ...
} satisfies VariantMeta<Props>;

type Story = StoryObj<typeof Props> & VariantStoryObj<Props>;

export const MyComponent: Story = {
  name: "My Component (Default)",
  // ...
}

export const MyComponentDisabled: Story {
  name: "My Component (Disabled)"
  args: {
    disabled: true
  }
}

export const SizeEnum {
  small,
  medium,
  large
}

// required
export const stories = () => generateStoriesByEnum<Props, typeof SizeEnum>(
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

### Motivation

For example, let's say you want to map a Story `arg` to your component prop `state` to support a matrix of UI states:
| |Open|Closed|
|---------|----|------|
|Active |t1 |t2 |
|Disabled |t3 |t4 |

To test each variant, traditionally, you would need to export 4 total stories imperatively:

```ts
// my-component.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { type Props, MyComponent } from './my-component';

/* CSF Declarations */
const meta = {
  title: 'Components/MyComponent',
  tags: ['autodocs'],
  render: MyComponent
} satisfies Meta<Props>;

export default meta;

type Story = StoryObj<Props>;

const Active: Story = {
  args: {
    state: 'active',
  }
};

const Disabled: Story = {
  args: {
    state: 'disabled'
  }
};

const Open: Story = {
  args: {
    open: true,
  }
};

const Closed: Story = {
  args: {
    open: false,
  }
};

/* CSF Story exports begin */
export const T1: Story = {
  name: 'Open (Active)',
  args: {
    ...Open.args
    ...Active.args,
  }
};

/* Rest...
export const T2;
export const T3;
export const T4;
...
*/
```

As the UI matrix grows...

|           | Open | Closed |
| --------- | ---- | ------ |
| Active    | t1   | t2     |
| Disabled  | t3   | t4     |
| Visited   | t5   | t6     |
| Read Only | t7   | t8     |

the complexity grows...

```ts
/* ... */
export const T5;
export const T6;
export const T7;
export const T8;
```

By using the addon and [generateStoriesByEnum](../utils/README.md#stories-by-enum) utility, we can simplify to:

```ts
// continued...

enum States = {
  Active,
  Disabled,
  Visited,
  ReadOnly
};

const OpenedTemplate: Story = {
  ...Open,
  name: 'Open',
};

const ClosedTemplate: Story = {
  ...Closed,
  name: 'Closed',
};

export const stories = () => generateStoriesByEnum([OpenedTemplate, ClosedTemplate], 'state', States);
```

As you can see, we only need to manage one export (`stories`) and the utility will generate a flat list of matrix stories for the Storybook addon renderer. This removes complexity in structuring Story using the default [Component Story Format](https://github.com/ComponentDriven/csf).

> _Note: Also remember to add required metadata and exports as mentioned in [setup](../addons/README.md#setup)._

### Limitations

- `default` export and `exportName: 'default'` is not allowed for variant files or Story templates
- Direct imports to component files should be avoided (except for type references)
- `args` properties are serialized to JSON, so please be careful of **non-JSON** types
- For testing, you must run `test-runner` with [Index.json mode](https://storybook.js.org/docs/writing-tests/test-runner#indexjson-mode). See related [issue](https://github.com/storybookjs/test-runner/issues/262)
