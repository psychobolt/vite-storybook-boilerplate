import type { StoryObj } from '@storybook/web-components-vite';
import type { VariantsMeta } from 'commons/esm/.storybook/addons/addon-variants.js';
import {
  type VariantStoryObj,
  generateStoriesByEnum
} from 'commons/esm/.storybook/utils/story-generators.js';

import type { Props } from 'Button';

export type Meta = VariantsMeta<Props>;

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
export const meta = {
  title: 'Components/Button/Primary/Sizes',
  fileName: 'Button',
  importName: 'Button',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large']
    }
  },
  decorators: [(Story) => Story()]
} satisfies Meta;

export type Story = StoryObj<Props> & VariantStoryObj<Props>;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Primary: Story = {
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

export const stories = (template = Primary) =>
  generateStoriesByEnum([template], 'size', SizeEnum);
