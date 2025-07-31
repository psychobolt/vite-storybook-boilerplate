import { ESLint } from 'eslint';
import stylelint from 'stylelint';

export interface Results {
  eslint?: ESLint.LintResult[];
  stylelint?: stylelint.LintResult[];
}

export type Formatter = (results: Results) => string | Promise<string>;

export interface Reporter {
  process(results: Results): Promise<void>;
  publish(): Promise<void>;
}

export type Runner<T> = (
  cliArgs: string[],
  formatter: Set<string | Formatter | Reporter>
) => Promise<T>;
