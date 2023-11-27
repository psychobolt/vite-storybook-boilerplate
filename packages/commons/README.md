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

See [source](eslint.config.ts)

/your/project/eslint.config.ts

```ts
import commonConfig from "commons/eslint.config.ts"; // .ts is required here

export default {
  ...commonConfig,
  // your overrides
};
```

#### Prettier

See [source](prettier.config.ts)

/your/project/prettier.config.ts

```ts
import commonConfig from "commons/prettier.config";

export default {
  ...commonConfig,
  // your overrides
};
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

See [source](.storybook/vite-main.ts)

/your/project/.storybook/main.ts

```ts
import commonConfig from "commons/.storybook/vite-main";

export default mergeConfig({
  ...commonConfig,
  // your overrides
};
```

##### Jest

See [source](.storybook/test-runner-jest.config.ts)

/your/project/.storybook/test-runner-jest.config.ts

```ts
import commonConfig from "commons/.storybook/test-runner-jest.config.ts"; // .ts is required here

export default {
  ...commonConfig,
  // your overrides
};
```
