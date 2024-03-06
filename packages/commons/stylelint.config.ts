import path from "path";
import { createRequire } from "module";
import type { Config } from "stylelint";

const require = createRequire(import.meta.url);

function getAbsolutePath(moduleId: string) {
  return process.env.PROJECT_CWD
    ? require.resolve(moduleId)
    : path.join(
        process.cwd(),
        "packages/third-party/node_modules",
        ...arguments,
      );
}

const config: Config = {
  extends: [
    getAbsolutePath("stylelint-config-standard-scss"),
    getAbsolutePath("stylelint-config-prettier-scss"),
  ],
  allowEmptyInput: true,
};

export default config;
// @ts-expect-error: allow for CommonJS target
export = config;
