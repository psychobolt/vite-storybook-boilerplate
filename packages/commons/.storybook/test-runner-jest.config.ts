import type { Config } from "@jest/types";
import { getJestConfig } from "@storybook/test-runner";

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

const config: Config.InitialOptions = {
  ...testRunnerConfig,
  /** Add your own overrides below, and make sure
   *  to merge testRunnerConfig properties with your own
   * @see https://jestjs.io/docs/configuration
   */
  // passWithNoTests: true
};

export default config;
