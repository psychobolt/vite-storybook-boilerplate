# Commons

Private package for sharing configs and scripts...

## Setup

```
yarn [workspace workspace-name] add -DE commons
```

### Configs

#### Vite

See [source](vite.config.ts)

```js
import commonConfig from "commons/esm/vite.config";
```

#### ESLint

See [source](eslint.config.ts)

```ts
import commonConfig from "commons/eslint.config.ts";
```

#### TSConfig

See [source](tsconfig.js)

```json
{
  "extends": "commons/tsconfig.json"
}
```

#### Storybook

##### Vite

```sh
yarn add -DE @storybook/addon-coverage
```

See [source](.storybook/vite-main.ts)

```js
import commonConfig from "commons/.storybook/vite-main";
```
