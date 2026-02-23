import {
  type Preview,
  type ReactTypes,
  definePreview
} from '@storybook/react-vite';
import { withDefaults } from 'commons/esm/.storybook/preview';

// See issue: https://github.com/storybookjs/storybook/issues/33798
const parameters: Preview['parameters'] = {
  options: {
    storySort: {
      order: ['Configure your project', 'Readme']
    }
  }
};

export default {
  parameters,
  ...withDefaults<ReactTypes>(
    (defaults) =>
      definePreview({
        ...defaults,
        parameters: {
          ...defaults.parameters,
          ...parameters
        }
      }) as any
  )
};
