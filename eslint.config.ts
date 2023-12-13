import commonConfig from "commons/eslint.config.ts";

export default [
  ...commonConfig,
  {
    ignores: ["apps/", "packages/"],
  },
];
