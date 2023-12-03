# Commons

Private package for sharing configs and scripts...

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
import commonConfig from "commons/esm/vite.config";

export default mergeConfig(
  commonConfig,
  defineConfig({
    // your overrides
  })
);
```

#### ESLint

1. Create your own config:

   See [source](eslint.config.ts)

   /your/project/eslint.config.ts

   ```ts
   import commonConfig from "commons/eslint.config.ts";

   export default {
     ...commonConfig,
     // your overrides
   };
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

   /your/project/prettier.config.ts

   ```ts
   import commonConfig from "commons/prettier.config";

   export default {
     ...commonConfig,
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

#### Stylelint

See [source](stylelint.config.ts)

/your/project/stylelint.config.cjs

```cjs
module.exports = {
  extends: ["commons/cjs/stylelint.config"],
};
```

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
   import commonConfig from "commons/.storybook/vite-main.ts";

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
import type { Preview } from "@storybook/react"; // preview-api type
import commonConfig from "commons/.storybook/preview.ts";

const preview: Preview = {
  ...commonConfig,
};

export default preview;
```

##### [Addons](.storybook/addons/README.md)

##### Jest

See [source](.storybook/test-runner-jest.config.ts)

/your/project/.storybook/test-runner-jest.config.ts

```ts
import commonConfig from "commons/.storybook/test-runner-jest.config.ts";

export default {
  ...commonConfig,
  // your overrides
};
```
