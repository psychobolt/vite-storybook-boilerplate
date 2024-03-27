import jsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import defaultConfig, { type Config } from "commons/esm/eslint.config.js";

const commonConfig: Config = defaultConfig;

const config: Config = [...commonConfig, jsxRuntime];

export default config;
