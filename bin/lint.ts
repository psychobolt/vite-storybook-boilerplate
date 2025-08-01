import arg from 'arg';
import { stylelint } from 'stylelint-config/esm/utils/runners.js';

import { Bitbucket, ErrorReporter } from './utils/reporters.ts';
import { eslint } from './utils/runners.ts';

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
        return new Bitbucket();
      }
      return name;
    })
  );

  formatters.add('default');

  const results = {
    eslint: runners.has('eslint') ? await eslint(['.'], formatters) : [],
    stylelint: runners.has('stylelint')
      ? await stylelint(['**/*.{sc,c}ss'], formatters)
      : []
  };

  for (const formatter of formatters) {
    if (typeof formatter === 'object') {
      await formatter.publish();
    }
  }

  try {
    const errorReporter = new ErrorReporter();
    await errorReporter.process(results);
  } catch (e) {
    process.exitCode = 1;
  }
} catch (e) {
  process.exitCode = 1;
  console.error(e);
}
