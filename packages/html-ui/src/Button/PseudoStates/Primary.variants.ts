import { html } from 'lit';
import { queryByRole, expect } from 'storybook/test';
import {
  type StoryPseudoStateArgs,
  generatePseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';

import preview from '.storybook/preview';
import { getPseudoStateArgTypes } from 'utils/functions';
import type { Props } from 'Button';
import primaryMeta from 'Button/Primary.story';

export type Args = Omit<Props, 'storyPseudo' | 'storyAttr'> &
  StoryPseudoStateArgs;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories/introduction
const meta = preview.type<{ args: Args }>().meta({
  ...primaryMeta.extend({
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: getPseudoStateArgTypes(),
    decorators: [(Story) => html`<div style="padding: 3px">${Story()}</div>`]
  }),
  title: 'Components/Button/Primary/Pseudo States',
  args: {
    storyPseudo: 'none',
    storyAttr: 'none'
  }
});

export default meta;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = meta.story({
  play({ canvasElement }) {
    const button = queryByRole(canvasElement, 'button');
    expect(button).toBeTruthy();
  }
});

export const stories = (template = Primary) =>
  generatePseudoStateStories(template, { showDefault: false });
