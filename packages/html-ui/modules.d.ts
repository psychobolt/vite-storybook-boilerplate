declare module 'commons/esm/.storybook/addons/addon-variants' {
  import type { WebComponentsRenderer } from '@storybook/web-components-vite';
  import type { VariantsMeta as DefaultVariantsMeta } from 'commons/esm/.storybook/addons/addon-variants.d.ts';

  export * from 'commons/esm/.storybook/addons/addon-variants.d.ts';

  export interface VariantsMeta<TArgs> extends DefaultVariantsMeta<
    TArgs,
    WebComponentsRenderer
  > {}
}

declare module 'commons/esm/.storybook/utils/story-generators.js' {
  import type { StoryPseudoStateProps as DefaultStoryPseudoStateProps } from 'commons/esm/.storybook/utils/story-generators.d.ts';

  export * from 'commons/esm/.storybook/utils/story-generators.d.ts';

  export interface DirectiveResult {
    values: Array<{ [key: string]: string }>;
  }

  export interface StoryPseudoStateProps extends DefaultStoryPseudoStateProps {
    storyAttr?: DirectiveResult;
  }
}
