import commonConfig from "commons/esm/eslint.config.js";

export default [
  ...commonConfig,
  {
    ignores: ["apps/", "packages/"],
  },
];
