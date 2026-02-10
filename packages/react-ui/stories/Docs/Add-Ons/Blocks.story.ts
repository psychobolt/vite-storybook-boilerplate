import type { Meta, StoryObj } from '@storybook/react-vite';

import { type Props, Markdown } from './Markdown';

const meta = {
  title: 'Add Ons/Blocks/Markdown',
  tags: ['autodocs'],
  component: Markdown
} satisfies Meta<Props>;

export default meta;

type Story = StoryObj<Props>;

export const Badge: Story = {
  args: {
    children:
      '[![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://img.shields.io/badge/license-MIT-blue)'
  }
};
