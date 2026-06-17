import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: false // See issue: https://github.com/vitest-dev/vitest/issues/8572
  },
  test: {
    coverage: {
      exclude: ['**/*.@(story|stories).@(js|jsx|ts|tsx)']
    },
    reporters: ['default', ['junit', { outputFile: 'test-reports/junit.xml' }]]
  }
});
