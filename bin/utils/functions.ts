import { exec, type ExecException, type ExecOptions } from 'node:child_process';

interface ExecResult<E> {
  error: E | null;
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
  new Promise<ExecResult<ExecException>>((resolve) => {
    const childProcess = exec(command, options, (error, stdout, stderr) =>
      resolve({ error, stdout: stdout.toString(), stderr: stderr.toString() })
    );
    if (!silent) {
      childProcess.stdin?.pipe(process.stdin);
      childProcess.stdout?.pipe(process.stdout);
      childProcess.stderr?.pipe(process.stderr);
    }
  });
