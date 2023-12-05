import type { Config } from "stylelint";

const config: Config = {
  extends: ["stylelint-config-standard-scss", "stylelint-config-prettier-scss"],
  allowEmptyInput: true
};

export default config;
// @ts-expect-error: allow for CommonJS target
export = config;
