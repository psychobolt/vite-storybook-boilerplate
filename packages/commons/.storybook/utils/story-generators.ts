import type {
  Args,
  Renderer,
  StoryAnnotations
} from 'storybook/internal/types';
import type { StringKeyOf } from 'ts-enum-util/dist/types/types.js';
import { $enum } from 'ts-enum-util';
import _ from 'lodash';

import type { VariantStory } from '../addons/addon-variants.js';

export type VariantStoryObj<TArgs = Args> = StoryAnnotations<
  Renderer,
  TArgs
> & {
  exportName?: string;
};

export type EnumLike<E> = Record<StringKeyOf<E>, string | number>;

export function generateStoriesByEnum<TArgs, E extends EnumLike<E>>(
  templates: Array<VariantStoryObj<TArgs>>,
  arg: string,
  enumerator: E
) {
  return templates.reduce<Array<VariantStory<TArgs>>>(
    (variants, story) => [
      ...variants,
      ...Array.from($enum(enumerator).keys()).map<VariantStory<TArgs>>(
        (key) => ({
          name: `${story.name ? story.name + ' - ' : ''}${_.startCase(key)}`,
          exportName: _.snakeCase(story.name ? `${story.name}_${key}` : key),
          args: {
            ...story.args,
            [arg]: key
          }
        })
      )
    ],
    []
  );
}

export enum DefaultPseudoClsEnum {
  focus = ':focus',
  active = ':active',
  hover = ':hover'
}

export enum DefaultStateAttrEnum {
  disabled = '{"disabled": true}'
}

export interface PseudoStateOptions<
  P extends EnumLike<P>,
  A extends EnumLike<A>
> {
  pseudoClasses?: P;
  stateAttributes?: A;
}

interface PseudoStateStoryOptions<
  P extends EnumLike<P>,
  A extends EnumLike<A>,
  TArgs
> extends PseudoStateOptions<P, A> {
  showDefault?: boolean | VariantStory<TArgs>;
}

export const generatePseudoStateStories = <
  TArgs extends Partial<TArgs>,
  P extends EnumLike<P> = {},
  A extends EnumLike<A> = {}
>(
  Template: VariantStoryObj<TArgs>,
  {
    showDefault,
    pseudoClasses,
    stateAttributes
  }: PseudoStateStoryOptions<P, A, TArgs> = {}
) => [
  ...[
    showDefault ?? {
      name: 'Default',
      exportName: 'Default',
      ...Template,
      args: {
        ...Template.args,
        storyPseudo: 'none',
        storyAttr: 'none'
      }
    }
  ].filter(<T>(story: T | boolean): story is T => story !== false),
  ...generateStoriesByEnum(
    [Template],
    'storyPseudo',
    pseudoClasses || DefaultPseudoClsEnum
  ),
  ...generateStoriesByEnum(
    [Template],
    'storyAttr',
    stateAttributes || DefaultStateAttrEnum
  )
];

export interface StoryPseudoStateArgs<
  P = typeof DefaultPseudoClsEnum,
  A = typeof DefaultStateAttrEnum
> extends Args {
  storyPseudo: 'none' | keyof P;
  storyAttr: 'none' | keyof A;
}

export interface StoryPseudoStateProps {
  storyPseudo?: string;
  storyAttr?: Record<string, string | boolean>;
}
