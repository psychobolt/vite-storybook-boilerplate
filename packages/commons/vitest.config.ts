import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, '*.config.js']
    },
    reporters: ['default', ['junit', { outputFile: 'test-reports/junit.xml' }]]
  }
});
