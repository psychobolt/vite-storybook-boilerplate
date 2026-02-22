import { type ReactTypes, definePreview } from '@storybook/react-vite';
import { withDefaults } from 'commons/esm/.storybook/preview';

export default {
  ...withDefaults<ReactTypes>(
    (defaults) =>
      definePreview({
        ...defaults,
        parameters: {
          ...defaults.parameters,
          options: {
            storySort: {
              order: ['Configure your project', 'Readme']
            }
          }
        }
      }) as any
  )
};
