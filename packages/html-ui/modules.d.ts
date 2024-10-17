import { StoryPseudoStateProps as DefaultPseudoStateProps } from 'commons/esm/.storybook/utils/story-generators';

declare module 'commons/esm/.storybook/utils/story-generators' {
  interface DirectiveResult {
    values: Array<{ [key: string]: string }>;
  }

  export interface HTMLStoryPseudoStateProps
    extends Omit<DefaultPseudoStateProps, 'storyAttr'> {
    storyAttr?: DirectiveResult;
  }
}
