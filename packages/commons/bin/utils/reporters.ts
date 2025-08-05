import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';

import { $, hash } from './functions.js';
import type { Results } from './runners.js';

const writeFile = util.promisify(fs.writeFile);

export interface Reporter {
  process(results: Results): Promise<void>;
  publish(): Promise<void>;
}

export class ErrorReporter implements Reporter {
  async process(details: Results) {
    const error = new Error('Failed code analysis');
    if (details.eslint) {
      for (const detail of details.eslint) {
        if (detail.errorCount > 0) throw error;
      }
    }
    if (details.stylelint) {
      for (const detail of details.stylelint) {
        if (detail.errored) throw error;
      }
    }
    console.log('\nNo errors reported.');
  }

  async publish() {}
}

enum AnnotationType {
  VULNERABILITY = 'VULNERABILITY',
  CODE_SMELL = 'CODE_SMELL',
  BUG = 'BUG'
}

enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

interface Annotation {
  external_id: string;
  path: string;
  annotation_type: keyof typeof AnnotationType;
  line: number;
  severity: keyof typeof Severity;
  [prop: string]: string | number;
}

export class Bitbucket implements Reporter {
  report = {
    title: 'Code Report',
    details: 'Summary of errors and warnings',
    report_type: 'TEST',
    result: 'PENDING',
    data: [
      {
        title: 'Error Count',
        type: 'NUMBER',
        value: 0
      },
      {
        title: 'Warning Count',
        type: 'NUMBER',
        value: 0
      }
    ]
  };

  annotations: Annotation[] = [];

  async process(results: Results) {
    const currentDir = process.cwd();
    const commit = (await $('git rev-parse HEAD', { silent: true })).trim();

    let totalErrorCount = 0;
    let totalWarningCount = 0;
    let workspace = path.basename(currentDir);
    workspace =
      path.basename(process.env.PROJECT_CWD ?? '') === workspace
        ? ''
        : workspace;

    if (results.eslint) {
      const SEVERITIES = Object.values(Severity);

      for (const result of results.eslint) {
        totalErrorCount += result.errorCount;
        totalWarningCount += result.warningCount;

        const relativePath = path.join(
          workspace,
          path.relative(currentDir, result.filePath)
        );

        for (const message of result.messages) {
          this.annotations.push({
            external_id: hash(
              'sha1',
              `lint:${relativePath}:${message.line}:${commit}`
            ),
            path: relativePath,
            annotation_type: AnnotationType.CODE_SMELL,
            summary: message.message,
            line: message.line,
            severity: SEVERITIES[message.severity] ?? Severity.MEDIUM
          });
        }
      }
    }

    if (results.stylelint) {
      const SEVERITIES = {
        warning: Severity.MEDIUM,
        error: Severity.HIGH
      };

      for (const result of results.stylelint) {
        for (const warning of result.warnings) {
          if (warning.severity === 'error') {
            totalErrorCount++;
          } else {
            totalWarningCount++;
          }

          const relativePath =
            result.source &&
            path.join(workspace, path.relative(currentDir, result.source));
          if (relativePath) {
            this.annotations.push({
              external_id: hash(
                'sha1',
                `lint:${relativePath}:${warning.line}:${commit}`
              ),
              path: relativePath,
              annotation_type: AnnotationType.CODE_SMELL,
              summary: warning.text,
              line: warning.line,
              severity: SEVERITIES[warning.severity] ?? Severity.MEDIUM
            });
          }
        }
      }
    }

    this.report.result =
      totalErrorCount + totalWarningCount > 0 ? 'FAILED' : 'PASSED';
    this.report.data[0].value += totalErrorCount;
    this.report.data[1].value += totalWarningCount;
  }

  async publish() {
    await writeFile('bitbucket-report.json', JSON.stringify(this.report));
    await writeFile(
      'bitbucket-annotations.json',
      JSON.stringify(this.annotations)
    );
  }
}
