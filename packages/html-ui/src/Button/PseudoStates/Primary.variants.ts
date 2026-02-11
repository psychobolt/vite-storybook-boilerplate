import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import {
  type StoryPseudoStateArgs,
  generatePseudoStateStories
} from 'commons/esm/.storybook/utils/story-generators.js';

import { getPseudoStateArgTypes } from 'utils/functions';
import { type Props, Button } from 'Button';

const meta = {
  title: 'Components/Button/Primary/Pseudo States',
  tags: ['autodocs'],
  decorators: [(Story) => html`<div style="padding: 3px">${Story()}</div>`],
  render: Button,
  argTypes: getPseudoStateArgTypes()
} satisfies Meta<Props>;

export default meta;

type Args = Omit<Props, 'storyPseudo' | 'storyAttr'> & StoryPseudoStateArgs;

export type Story = StoryObj<Args>;

export const Primary: Story = {
  args: {
    label: 'Button',
    primary: true,
    storyPseudo: 'none',
    storyAttr: 'none'
  }
};

export const stories = (template = Primary) =>
  generatePseudoStateStories(template, { showDefault: false });
