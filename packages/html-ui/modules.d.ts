import type { WebComponentsRenderer } from '@storybook/web-components';

declare module 'commons/esm/.storybook/addons/addon-variants' {
  import type { VariantsMeta as DefaultVariantsMeta } from 'commons/.storybook/addons/addon-variants';

  export * from 'commons/.storybook/addons/addon-variants';

  export interface VariantsMeta<TArgs>
    extends DefaultVariantsMeta<TArgs, WebComponentsRenderer> {}
}

declare module 'commons/esm/.storybook/utils/story-generators' {
  import type { StoryPseudoStateProps as DefaultStoryPseudoStateProps } from 'commons/.storybook/utils/story-generators';

  export * from 'commons/.storybook/utils/story-generators';

  export interface DirectiveResult {
    values: Array<{ [key: string]: string }>;
  }

  export interface StoryPseudoStateProps extends DefaultStoryPseudoStateProps {
    storyAttr?: DirectiveResult;
  }
}
