import { exec, type ExecOptions } from 'node:child_process';

interface ExecResult {
  stdout: string;
  stderr: string;
}

export interface StdioExecOptions extends ExecOptions {
  silent?: boolean;
}

export const $ = (
  command: string,
  { silent = false, ...options }: StdioExecOptions = {}
) =>
  new Promise<ExecResult>((resolve, reject) => {
    const childProcess = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
    if (!silent) {
      const options = { end: false };
      childProcess.stdin?.pipe(process.stdin, options);
      childProcess.stdout?.pipe(process.stdout, options);
      childProcess.stderr?.pipe(process.stderr, options);
    }
  });
