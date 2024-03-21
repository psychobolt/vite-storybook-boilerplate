import path from "path";
import type { Config } from "stylelint";

function getQualifiedModule(moduleId: string) {
  return process.env.PROJECT_CWD
    ? moduleId
    : path.join(process.cwd(), "packages/third-party/node_modules", moduleId);
}

const config: Config = {
  extends: [
    getQualifiedModule("stylelint-config-standard-scss"),
    getQualifiedModule("stylelint-config-prettier-scss"),
  ],
  allowEmptyInput: true,
};

export default config;
// @ts-expect-error: allow for CommonJS target
export = config;
