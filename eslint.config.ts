import commonConfig, { tseslint } from "commons/esm/eslint.config.js";

export default tseslint.config(...commonConfig, {
  ignores: ["apps/", "packages/"],
});
