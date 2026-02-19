import 'react-syntax-highlighter';

import {
  type WebComponentsTypes,
  definePreview
} from '@storybook/web-components-vite';
import { SyntaxHighlighter } from 'storybook/internal/components';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import { withDefaults } from 'commons/esm/.storybook/preview';

SyntaxHighlighter.registerLanguage('scss', scss);

export default {
  ...withDefaults<WebComponentsTypes>((defaults) =>
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
    })
  )
};
