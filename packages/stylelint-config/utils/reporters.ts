import path from 'node:path';
import stylelint from 'stylelint';
import type { Runner } from 'commons/index.d.ts';

export const runner: Runner<stylelint.LintResult[]> = async (
  files,
  formatters
) => {
  console.log('\nRunning Stylelint...');

  const { report, results } = await stylelint.lint({
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
