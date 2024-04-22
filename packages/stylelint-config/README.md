# Stylelint Config

Local workspace for sharing Stylelint configs.

## SCSS

See [source](stylelint-scss.config.ts)

/your/project/stylelint.config.js

```js
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config/esm/stylelint-scss.config']
};
```