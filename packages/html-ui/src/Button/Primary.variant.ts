import type { StoryObj } from '@storybook/web-components';
import type { VariantsMeta } from 'commons/esm/.storybook/addons/addon-variants.js';
import {
  type VariantStoryObj,
  generateStories
} from 'commons/esm/.storybook/utils.js';

import type { Props } from './Button.ts';

export type Meta = VariantsMeta<Props>;

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  title: 'Components/Button/Primary',
  fileName: './Button.ts',
  importName: 'Button',
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    }
  }
} satisfies Meta;

export type Story = StoryObj<Props> & VariantStoryObj<Props>;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {
  name: 'Primary',
  args: {
    label: 'Button',
    primary: true
  }
};

export enum SizeEnum {
  small,
  medium,
  large
}

export const stories = (stories = [Primary]) =>
  generateStories<Props, typeof SizeEnum>(stories, 'size', SizeEnum);
