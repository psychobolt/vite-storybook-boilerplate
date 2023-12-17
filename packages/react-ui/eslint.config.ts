import commonConfig, { compat, type Config } from "commons/eslint.config.ts";

const config: Config[] = [
  ...commonConfig,
  ...compat.extends("plugin:react/jsx-runtime"),
];

export default config;
