# Utils

## [Story Generators](story-generators.ts)

These utilities are ideally used with the [Variant addon](../addons/README.md#variants) and the open standard: [Component Story Format](https://github.com/ComponentDriven/csf).

### Stories By Enum

`generateStoriesByEnum(templates, arg, enumerator);`

The default export utility to create stories targeting a single `arg` type from the list of Story `templates` and `enumerators`.

### Pseudo State Stories

`generatePseudoStateStories(template, { showDefault?, pseudoClasses? = DefaultPseudoClsEnum, stateAttributes? = DefaultStateAttrEnum });`

The utility will take a single story template and decorate its `args` with additional pseudo-states. Unlike [generateStoriesByEnum](#stories-by-enum), it expects the predefined `args` ( `storyPseudo`, `storyAttr`) to be generated based on `pseudoClasses` and `stateAttributes` enums.

#### Options

- `showDefault` Displays the default Story template if set to `true` or a `Story`
- `pseudoClasses` Enumerator for [psuedo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes). Defaults: `hover`, `active`
- `stateAttributes` Emumerator for [attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes). Default: `disabled`

#### Usage Example

```ts
// my-component.ts
import { spread } from '@open-wc/lit-helpers';
import { html } from 'lit';
import type { StoryPseudoStateProps } from 'commons/esm/.storybook/utils/story-generators.js';

interface Props extends StoryPseudoStateProps {}

export const MyComponent = ({
  storyPseudo,
  storyAttr,
  ...props
}: Props) => html` <div class="${storyPseudo}" ${spread(storyAttr)}></div> `;
```

```ts
// my-component.story.ts
import type { VariantsMeta } from 'commons/esm/.storybook/addons/addon-variants.js';

import type { Props } from './my-component';
import type {
  MyPseudoClsEnum,
  MyStateAttrEnum
} from './my-component-story.types';

const meta = {
  title: 'Components/My Component',
  fileName: './my-component',
  importName: 'MyComponent'
} satisfies VariantsMeta<Props>;

export default meta;

type Story = StoryObj<Props> & VariantStoryObj<Props>;

const Template: Story = {};

export const stories = () =>
  generatePseudoStateStories(Template, {
    pseudoClasses: MyPseudoClsEnum,
    stateAttributes: MyStateAttrEnum
  });
```

## [Functions](functions.ts)

General utilities for Storybook.

### Get Pseudo State Arg Types

Ideally used with [generatePseudoStateStories](#default-pseudo-state-stories).

`getPseudoStateArgTypes({ pseudoClasses?, stateAttributes?, argStateAttrMapper? })`

#### Options

- `pseudoClasses` Similar to `generatePseudoStateStories`, if you decided to override the defaults, you will need to override them here as well.
- `stateAttributes` Ditto
- `argStateAttrMapper` (Default: `(attributes) => attributes`) By default, the Story input type for `stateAttributes` will be [mapped](https://storybook.js.org/docs/api/arg-types#mapping) and passed to the Story's `render` as a list of `props`. You can use this option to augment the respective key or value for each available attribute.

#### Usage

```ts
// my-component.story.ts
const meta = {
  /* ... */
  argTypes: {
    /* ... */
    ...getPseudoStateArgTypes(/* options */);
  }
} satisfies Story<Props>;

export default meta;
```
