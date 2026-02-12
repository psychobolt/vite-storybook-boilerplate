import addonDocs from '@storybook/addon-docs';
import {
  type Renderer,
  type ProjectAnnotations,
  type InferTypes,
  type PreviewAddon,
  type Preview,
  definePreview
} from 'storybook/internal/csf';

const addons = [addonDocs()];

type Addons = typeof addons;

type DefaultRenderer = Renderer & InferTypes<Addons>;

const input: ProjectAnnotations<DefaultRenderer> & { addons: Addons } = {
  addons,
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export const withDefaults = <
  TRenderer extends Renderer,
  TAddons extends PreviewAddon[],
  TPreview extends Preview<TRenderer & DefaultRenderer & InferTypes<TAddons>>
>(
  preview: (defaults: typeof input) => TPreview
) => preview(input);

export default definePreview(input);
