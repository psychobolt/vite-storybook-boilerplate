# Commons

Local workspace for sharing configs and scripts...

## Setup

```
yarn [workspace workspace-name] add -DE commons
```

### Configs

#### Vite

See [source](vite.config.ts)

/your/project/vite.config.ts

```js
import { defineConfig, mergeConfig } fromn "vite";
import commonConfig from 'commons/esm/vite.config';

export default mergeConfig(
  commonConfig,
  defineConfig({
    // your overrides
  })
);
```

#### Vitest

1. Create your own config:

   See [source](vitest.config.ts)

   /your/project/vitest.config.ts

   ```ts
   import { mergeConfig } from 'vitest/config';
   import commonConfig from 'commons/esm/vitest.config';

   import viteConfig from './vite.config';

   export default mergeConfig(commonConfig, viteConfig);
   ```

2. Add scripts to /your/project/package.json

   ```json
   {
     "scripts": {
       "test": "yarn g:vitest run",
       "coverage": "yarn test --coverage"
     }
   }
   ```

#### ESLint

1. Create your own config:

   See [source](eslint.config.ts)

   /your/project/eslint.config.ts

   ```ts
   import { defineConfig } from 'eslint/config';
   import commonConfig from 'commons/esm/eslint.config.js';

   export default defineConfig(
     ...commonConfig
     // your overrides
   );
   ```

2. Add scripts to /your/project/package.json

   ```json
   {
     "scripts": {
       "lint": "yarn g:lint-css && yarn g:lint-js"
     }
   }
   ```

#### Prettier

1. Create your own config:

   See [source](prettier.config.ts)

   /your/project/prettier.config.js

   ```js
   import commonConfig from 'commons/esm/prettier.config.js';

   /**
    * @type {import("prettier").Config}
    */
   export default {
     ...commonConfig
     // your overrides
   };
   ```

2. Add scripts to /your/project/package.json

   ```json
   {
     "scripts": {
       "lint": "yarn g:prettier --check .",
       "format": "yarn g:prettier --write ."
     }
   }
   ```

#### Lint Staged

See [source](lint-staged.base.config.ts)

/your/project/lint-staged.config.js

```js
import commonConfig from 'commons/esm/lint-staged.base.config.js`

/**
* @type {import('lint-staged').Configuration}
*/
export default {
  ...commonConfig
  // your overrides
};
```

#### Stylelint

Moved to [stylelint-config](../stylelint-config/)

#### TSConfig

See [source](tsconfig.js)

/your/project/tsconfig.json

```json
{
  "extends": "commons/tsconfig.json"
}
```

#### Storybook

##### Vite

1. Create your own config:

   See [source](.storybook/vite-main.ts)

   /your/project/.storybook/main.ts

   ```ts
   import commonConfig from 'commons/esm/.storybook/vite-main';

   export default mergeConfig({
     ...commonConfig,
     // your overrides
   };
   ```

2. Add scripts to /your/project/package.json

   ```json
   {
     "scripts": {
       "dev": "yarn g:storybook dev",
       "build-storybook": "yarn g:storybook build"
     }
   }
   ```

##### Preview

See [source](.storybook/preview.ts)

/your/project.storybook/preview.ts

```ts
import type { Preview } from '@storybook/react'; // preview-api type
import commonConfig from 'commons/esm/.storybook/preview';

const preview: Preview = {
  ...commonConfig
};

export default preview;
```

##### [Addons](.storybook/addons/README.md)

##### Test Runner

1. Create your own config:

   See [source](.storybook/test-runner-jest.config.ts)

   /your/project/.storybook/test-runner-jest.config.ts

   ```ts
   import commonConfig from 'commons/esm/.storybook/test-runner-jest.config';

   export default {
     ...commonConfig
     // your overrides
   };
   ```

2. Add scripts to /your/project/package.json

   ```json
   {
     "scripts": {
       "test": "yarn g:test-storybook --index-json"
     }
   }
   ```

##### Vitest

1. Add a [Vitest](#vite-1) root config.

2. Create your own config:

   See [source](.storybook/vitest.config.ts)

   /your/project/.storybook/vitest.config.ts

   ```ts
   import { mergeConfig } from 'vitest/config';
   import commonConfig from 'commons/esm/.storybook/vitest.config.js';

   import viteConfig from './vite.config';

   export default mergeConfig(commonConfig, viteConfig);
   ```

3. Extend the root config:

   /your/project/vitest.config.ts

   ```ts
   import { mergeConfig } from 'vitest/config';
   import commonConfig from 'commons/esm/vitest.config';

   import storybookConfig from './.storybook/vitest.config';
   import viteConfig from './vite.config';

   export default mergeConfig(
     mergeConfig(commonConfig, viteConfig),
     storybookConfig
   );
   ```
