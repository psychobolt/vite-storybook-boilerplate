import { type ExecOptions, exec, spawn } from 'node:child_process';
import { type BinaryToTextEncoding, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const EXIT_SUCCESS = 0;
export const EXIT_INVALID_USAGE = 1;
export const EXIT_INVALID_ARGUMENTS = 2;

type ReadFileOptions = Parameters<typeof readFile>[1];

export const readFileFromCwd = (path: string, options: ReadFileOptions = {}) =>
  readFile(resolve(process.cwd(), path), options);

export interface StdioExecOptions extends ExecOptions {
  silent?: boolean;
}

export const $ = (
  command: string,
  { silent = false, ...options }: StdioExecOptions = {}
) => {
  const error = new Error();
  return new Promise<string>((resolve, reject) => {
    if (silent) {
      exec(command, options, (e, stdout, stderr) => {
        if (e) {
          error.message = e.message;
          e.message = stderr.toString() || stdout.toString() || e.message;
          error.cause = e;
          reject(error);
        } else {
          resolve(stdout.toString());
        }
      });
      return;
    }

    const env = { ...(options.env ?? process.env) };
    const { NODE_DISABLE_COLORS, NO_COLOR, FORCE_COLOR } = env;
    if (
      [NODE_DISABLE_COLORS, NO_COLOR, FORCE_COLOR].every(
        (value) => value !== undefined
      ) &&
      process.stdout.isTTY &&
      process.stdout.hasColors()
    ) {
      env.FORCE_COLOR = '1';
    }

    const childProcess = spawn(command, {
      ...options,
      env,
      shell: options.shell ?? true,
      stdio: 'inherit'
    });
    childProcess.once('error', (e) => {
      error.message = e.message;
      error.cause = e;
      reject(error);
    });
    childProcess.once('close', (code, signal) => {
      if (code === 0) {
        resolve('');
      } else {
        error.message = `Command failed: ${command} (${signal ?? code})`;
        reject(Object.assign(error, { code, signal }));
      }
    });
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
  const hash = createHash(algorithm);
  hash.update(data);
  return hash.digest(
    (typeof options === 'object' ? options?.encoding : options) ?? 'hex'
  );
}

export interface TurboTask {
  taskId: string;
  task: string;
  hash: string;
  package: string;
  directory: string;
  dependencies: string[];
  dependents: string[];
}

export async function getDependentTasks(
  name: string,
  execOptions: ExecOptions = {}
) {
  let result: { tasks: TurboTask[] };
  try {
    const stdout = await $(
      `yarn turbo run ${name}${typeof execOptions.cwd === 'string' ? ' --filter=^...' : ''} --dry-run=json`,
      {
        ...execOptions,
        silent: true
      }
    );
    result = JSON.parse(stdout);
    return result.tasks.filter(({ task }) => task === name);
  } catch {
    return [];
  }
}
