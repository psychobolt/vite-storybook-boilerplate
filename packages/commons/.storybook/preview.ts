import type { ProjectAnnotations } from '@storybook/types';

const preview: ProjectAnnotations<any> = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      source: {
        excludeDecorators: true
      }
    }
  }
};

export default preview;
