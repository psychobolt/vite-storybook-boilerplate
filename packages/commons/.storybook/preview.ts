import addonDocs from '@storybook/addon-docs';
import {
  type Renderer,
  type ProjectAnnotations,
  type PreviewAddon,
  type InferTypes,
  definePreview as _definePreview
} from 'storybook/internal/csf';
import _ from 'lodash';

type InferCSF4<TRenderer> = TRenderer extends Renderer
  ? TRenderer & { csf4: true }
  : never;

export const definePreview = <
  TRenderer extends Renderer,
  TAddons extends PreviewAddon<never>[],
  TPreview extends typeof _definePreview<InferCSF4<TRenderer>, TAddons> =
    typeof _definePreview<InferCSF4<TRenderer>, TAddons>
>(
  ...[input]: Parameters<TPreview>
) => {
  const addons = [addonDocs()];
  const projectAddons = [...addons, ...(input.addons ?? [])];

  const defaults: ProjectAnnotations<Renderer & InferTypes<typeof addons>> = {
    parameters: {
      actions: { argTypesRegex: '^on[A-Z].*' },
      docs: {},
      controls: {
        matchers: {
          color: /(background|color)$/i,
          date: /Date$/i
        }
      }
    }
  };

  return _definePreview<InferCSF4<TRenderer>, typeof projectAddons>(
    _.merge(defaults, input, { addons: projectAddons })
  );
};

export default definePreview({ addons: [] });
