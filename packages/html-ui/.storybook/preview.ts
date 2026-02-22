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
        docs: {
          source: {
            async transform(code) {
              const prettier = await import('prettier/standalone');
              const prettierPluginBabel =
                await import('prettier/plugins/babel');
              const prettierPluginEstree =
                await import('prettier/plugins/estree');
              const prettierPluginHtml = await import('prettier/plugins/html');
              return prettier.format(code, {
                parser: 'babel',
                plugins: [
                  prettierPluginBabel,
                  prettierPluginEstree,
                  prettierPluginHtml
                ]
              });
            }
          }
        },
        options: {
          storySort: {
            order: ['Configure your project', 'Readme']
          }
        }
      }
    })
  )
};
