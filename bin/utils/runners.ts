import { ESLint } from 'eslint';

import type { Runner } from 'commons/index.d.ts';

export const eslint: Runner<ESLint.LintResult[]> = async (
  files,
  formatters
) => {
  const eslint = new ESLint({
    flags: ['v10_config_lookup_from_file']
  });

  console.log('\nRunning ESLint...');
  const results = await eslint.lintFiles(files);

  for (const formatter of formatters) {
    let text;

    if (typeof formatter === 'string') {
      const textFormatter = await eslint.loadFormatter(
        formatter === 'default' ? 'stylish' : formatter
      );
      text = await textFormatter.format(results);
    } else if (typeof formatter === 'object') {
      await formatter.process({ eslint: results });
    } else {
      text = await formatter({ eslint: results });
    }

    if (text) {
      console.log(text);
    }
  }

  return results;
};
