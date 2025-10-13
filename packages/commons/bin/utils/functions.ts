import { type ExecOptions, exec } from 'node:child_process';
import crypto, { BinaryToTextEncoding } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const EXIT_SUCCESS = 0;
export const EXIT_INVALID_USAGE = 1;
export const EXIT_INVALID_ARGUMENTS = 2;

export interface StdioExecOptions extends ExecOptions {
  silent?: boolean;
}

export const $ = (
  command: string,
  { silent = false, ...options }: StdioExecOptions = {}
) => {
  const error = new Error();
  return new Promise<string>((resolve, reject) => {
    const childProcess = exec(command, options, (e, stdout, stderr) => {
      if (e) {
        error.message = e.message;
        if (silent) {
          e.message = stderr || stdout;
          error.cause = e;
        }
        reject(error);
      } else {
        resolve(stdout);
      }
    });
    if (!silent) {
      const options = { end: false };
      childProcess.stdin?.pipe(process.stdin, options);
      childProcess.stdout?.pipe(process.stdout, options);
      childProcess.stderr?.pipe(process.stderr, options);
    }
  });
};

export function hash(
  algorithm: string,
  data: string | Buffer | DataView,
  options?:
    | BinaryToTextEncoding
    | {
        encoding?: BinaryToTextEncoding;
      }
) {
  const hash = crypto.createHash(algorithm);
  hash.update(data);
  return hash.digest(
    (typeof options === 'object' ? options?.encoding : options) ?? 'hex'
  );
}

export const resolve = async (moduleId: string, cwd = process.cwd()) =>
  pathToFileURL(
    (
      await $(`cd ${cwd} && yarn node -p "require.resolve('${moduleId}')"`, {
        silent: true
      })
    ).trim()
  ).toString();
