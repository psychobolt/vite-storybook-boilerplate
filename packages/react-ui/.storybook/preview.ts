import type { Preview } from '@storybook/react';
import commonConfig from 'commons/esm/.storybook/preview';

const preview: Preview = {
  ...commonConfig,
  parameters: {
    ...commonConfig.parameters,
    options: {
      ...commonConfig.parameters?.options,
      storySort: {
        order: ['Configure your project', 'Readme']
      }
    }
  }
};

export default preview;
