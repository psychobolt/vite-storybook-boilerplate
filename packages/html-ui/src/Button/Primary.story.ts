import type { Meta, StoryObj } from '@storybook/web-components-vite';

import { type Props, Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/web-components/writing-stories/introduction
const meta = {
  title: 'Components/Button/Primary',
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' }
  },
  render: Button
} satisfies Meta<Props>;

export default meta;

export type Story = StoryObj<Props>;

// More on writing stories with args: https://storybook.js.org/docs/web-components/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Button',
    primary: true
  }
};
