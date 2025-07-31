import arg from 'arg';
import * as stylelint from 'stylelint-config/utils/reporters.ts';

import * as reporters from './utils/reporters.ts';

const args = arg({
  '--runner': [String],
  '--formatter': [String],
  '-f': '--formatter'
});

try {
  const runners = new Set(args['--runner'] ?? ['eslint']);
  const formatters = new Set(
    (args['--formatter'] ?? ['default']).map((name) => {
      if (name === 'bitbucket') {
        return new reporters.Bitbucket();
      }
      return name;
    })
  );

  formatters.add('default');

  const results = {
    eslint: runners.has('eslint')
      ? await reporters.eslint(['.'], formatters)
      : [],
    stylelint: runners.has('stylelint')
      ? await stylelint.runner(['**/*.{sc,c}ss'], formatters)
      : []
  };

  for (const formatter of formatters) {
    if (typeof formatter === 'object') {
      await formatter.publish();
    }
  }

  try {
    const errorReporter = new reporters.ErrorReporter();
    await errorReporter.process(results);
  } catch (e) {
    process.exitCode = 1;
  }
} catch (e) {
  process.exitCode = 1;
  console.error(e);
}
