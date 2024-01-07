import commonConfig, {
  compat,
  type Config,
} from "commons/esm/eslint.config.js";

const config: Config[] = [
  ...commonConfig,
  ...compat.extends("plugin:react/jsx-runtime"),
];

export default config;
