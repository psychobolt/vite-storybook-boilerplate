import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        'storybook-static/**',
        '*.config.?(c|m)[jt]s?(x)'
      ]
    },
    reporters: ['default', ['junit', { outputFile: 'test-reports/junit.xml' }]]
  }
});
