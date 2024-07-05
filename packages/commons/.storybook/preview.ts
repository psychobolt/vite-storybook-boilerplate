import type {
  DecoratorFunction,
  ProjectAnnotations,
  Renderer
} from '@storybook/types';

const decorators: Array<DecoratorFunction> = [];

const preview: ProjectAnnotations<any> = {
  decorators,
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

export const mergeGlobalDecorators = <TRenderer extends Renderer>(
  decorators: Array<DecoratorFunction<TRenderer>>
) => decorators.concat(decorators);
