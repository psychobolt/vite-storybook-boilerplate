import type { Config } from "stylelint";
import { createRequire } from "module";
import { dirname } from "path";

const require = createRequire(import.meta.url);

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
export function getAbsolutePath(moduleId: string): string {
  return dirname(require.resolve(moduleId));
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
