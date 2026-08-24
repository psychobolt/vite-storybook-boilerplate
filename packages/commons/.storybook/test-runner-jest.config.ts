import { createRequire } from 'node:module';
import { getJestConfig } from '@storybook/test-runner';
import type { JestPlaywrightConfig } from 'jest-playwright-preset';

import { mergeConfig } from './utils/functions.ts';

const require = createRequire(import.meta.url);

const isLocalHttps = (targetUrl: string | undefined): boolean => {
  if (!targetUrl) return false;

  try {
    const { hostname, protocol } = new URL(targetUrl);
    return (
      protocol === 'https:' &&
      ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)
    );
  } catch {
    return false;
  }
};

export type TestRunnerConfig = Omit<
  ReturnType<typeof getJestConfig>,
  'testEnvironmentOptions'
> & {
  testEnvironmentOptions: NonNullable<
    ReturnType<typeof getJestConfig>['testEnvironmentOptions']
  > & {
    'jest-playwright': Partial<JestPlaywrightConfig>;
  };
};

// The default Jest configuration comes from @storybook/test-runner
const testRunnerConfig = getJestConfig();

const playwrightEnvironmentOptions = {
  contextOptions: {
    ignoreHTTPSErrors: isLocalHttps(process.env.TARGET_URL)
  }
} satisfies Partial<JestPlaywrightConfig>;

const config: TestRunnerConfig = {
  ...testRunnerConfig,
  testEnvironmentOptions: mergeConfig(
    testRunnerConfig.testEnvironmentOptions ?? {},
    {
      'jest-playwright': playwrightEnvironmentOptions
    }
  ),
  /** Add your own overrides below, and make sure
   *  to merge testRunnerConfig properties with your own
   * @see https://jestjs.io/docs/configuration
   */
  passWithNoTests: true,
  reporters: [
    'default',
    [
      require.resolve('jest-junit'),
      {
        outputDirectory: 'test-reports'
      }
    ]
  ]
};

export default config;
