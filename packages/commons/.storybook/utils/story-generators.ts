import type { Args } from '@storybook/types';
import type { StringKeyOf } from 'ts-enum-util/dist/types/types.js';
import { $enum } from 'ts-enum-util';
import _ from 'lodash';

import type { VariantStory } from '../addons/addon-variants.ts';
import { getPseudoStateArgTypes } from './functions.js';

export interface VariantStoryObj<TArgs> {
  name?: string;
  args?: Partial<TArgs>;
}

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
          exportName: _.snakeCase(`${story.name}_${key}`),
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
  TArgs,
  P extends EnumLike<P>,
  A extends EnumLike<P>
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
  ].filter(Boolean),
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

export interface StoryPseudoStateProps {
  storyPseudo?: string;
  storyAttr?: Record<string, string | boolean>;
}

generatePseudoStateStories.getArgTypes = getPseudoStateArgTypes;
