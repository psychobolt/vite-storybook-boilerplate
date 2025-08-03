import path from 'node:path';
import type { ESLint } from 'eslint';
import type { LinterResult as StyleLintResult } from 'stylelint';

import { resolve } from './functions.js';
import type { Reporter } from './reporters.js';

export interface Results {
  eslint?: ESLint.LintResult[];
  stylelint?: StyleLintResult['results'];
}

export type Formatter = (results: Results) => string | Promise<string>;

export type Runner<T> = (
  cliArgs: string[],
  formatter: Set<string | Formatter | Reporter>
) => Promise<T>;

export const eslint: Runner<ESLint.LintResult[]> = async (
  files,
  formatters = new Set('default')
) => {
  const _ESLint: typeof ESLint = (await import(await resolve('eslint'))).ESLint;
  const eslint = new _ESLint({
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

export const stylelint: Runner<StyleLintResult['results']> = async (
  files,
  formatters = new Set('default')
) => {
  console.log('\nRunning Stylelint...');

  const _stylelint = (
    await import(path.join(await resolve('stylelint'), '../index.mjs'))
  ).default;
  const { report, results }: StyleLintResult = await _stylelint.lint({
    files,
    ignorePath: path.join(
      process.env.PROJECT_CWD ?? process.cwd(),
      '.gitignore'
    )
  });

  for (const formatter of formatters) {
    if (typeof formatter === 'object') {
      await formatter.process({ stylelint: results });
    }
  }

  if (report && formatters.has('default')) {
    console.log(report);
  }

  return results;
};
