import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { type Props, Header } from './Header';

const meta = {
  title: 'Components/Header',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/web-components/writing-docs/autodocs
  tags: ['autodocs', 'composite'],
  render: Header
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<Props>;

export const LoggedIn: Story = {
  args: {
    user: {
      name: 'Jane Doe'
    }
  }
};

export const LoggedOut: Story = {};
