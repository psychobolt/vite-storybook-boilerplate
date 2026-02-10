import type { Meta, StoryObj } from '@storybook/react-vite';

import { type Props, Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  tags: ['autodocs'],
  component: Badge
} satisfies Meta<Props>;

export default meta;

type Story = StoryObj<Props>;

export const Static: Story = {
  args: {
    children:
      '[![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://img.shields.io/badge/license-MIT-blue)'
  }
};
