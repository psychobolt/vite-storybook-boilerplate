import type { StringKeyOf } from "ts-enum-util/dist/types/types.js";
import { $enum } from "ts-enum-util";
import _ from "lodash";

import type { VariantStory } from "./addons/addon-variants.ts";

export interface VariantStoryObj<TArgs> {
  name?: string;
  args?: Partial<TArgs>;
}

export function generateStories<
  TArgs,
  Enum extends Record<StringKeyOf<Enum>, string | number>,
>(stories: Array<VariantStoryObj<TArgs>>, arg: string, enumerator: Enum) {
  return stories.reduce<Array<VariantStory<TArgs>>>(
    (variants, story) => [
      ...variants,
      ...Array.from($enum(enumerator).keys()).map<VariantStory<TArgs>>(
        (key) => ({
          name: `${story.name ? story.name + " - " : ""}${_.startCase(key)}`,
          exportName: _.snakeCase(`${story.name}_${key}`),
          args: {
            ...story.args,
            [arg]: key,
          },
        }),
      ),
    ],
    [],
  );
}
