import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/.storybook/**',
        '**/storybook-static/**',
        '**/*.@(story|stories).@(js|jsx|ts|tsx)',
        '**/*.mdx',
        '*.config.?(c|m)[jt]s?(x)'
      ]
    },
    reporters: ['default', ['junit', { outputFile: 'test-reports/junit.xml' }]]
  }
});
