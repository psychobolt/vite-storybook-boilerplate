import { defineConfig } from 'eslint/config';
import storybook from 'eslint-plugin-storybook';

// See issue https://github.com/storybookjs/eslint-plugin-storybook/issues/209
type StorybookPlugin = typeof import('eslint-plugin-storybook').default;

export default defineConfig(
  ...(storybook as unknown as StorybookPlugin).configs['flat/recommended'],
  {
    ignores: ['!.storybook']
  }
);
