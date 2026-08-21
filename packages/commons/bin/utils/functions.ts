import { type ExecOptions, exec } from 'node:child_process';
import { type BinaryToTextEncoding, createHash } from 'node:crypto';

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
          e.message = (stderr ?? stdout).toString();
          error.cause = e;
        }
        reject(error);
      } else {
        resolve(stdout.toString());
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
