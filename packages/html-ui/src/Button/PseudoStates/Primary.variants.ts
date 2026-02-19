import {
  type StoryPseudoStateArgs,
  type VariantStoryObj,
  generatePseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';

import preview from '.storybook/preview';
import { getPseudoStateArgTypes } from 'utils/functions';
import type { Props } from 'Button';
import primaryMeta from 'Button/Primary.story';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.meta({
  ...primaryMeta.input,
  title: 'Components/Button/Primary/Pseudo States',
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: getPseudoStateArgTypes()
});

export default meta;

type Args = Omit<Props, 'storyPseudo' | 'storyAttr'> & StoryPseudoStateArgs;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = meta.type<{ args: Args }>().story({
  args: {
    label: 'Button',
    primary: true,
    storyPseudo: 'none',
    storyAttr: 'none'
  }
});

export const stories = (template: VariantStoryObj = Primary.input) =>
  generatePseudoStateStories(template, { showDefault: false });
