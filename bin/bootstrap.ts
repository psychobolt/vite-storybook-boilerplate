import fs from 'fs';
import { join } from 'path';
import { $, execaSync } from 'execa';
import type { SyncOptions } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const argv = process.argv.slice(2);
const yarnCmd = (args: string[], options?: SyncOptions) =>
  execaSync('yarn', args, options);
const install = (options?: SyncOptions) =>
  yarnCmd(['install', ...argv], options);

async function* getWorkspacesByLinker() {
  const linkers: NodeLinker[] = ['pnpm', 'node-modules'];
  for (const linker of linkers) {
    const result: [NodeLinker, Workspace[]] = [
      linker,
      await getWorkspaces<Workspace[]>({
        nodeLinker: [linker]
      })
    ];
    yield result;
  }
}

type ArbitraryObject = Record<string, unknown>;
const isArbitaryObject = (e: unknown): e is ArbitraryObject =>
  typeof e === 'object';

type ExecaError = ArbitraryObject & { stderr: string };
const isExecaError = (e: unknown): e is ExecaError =>
  isArbitaryObject(e) && typeof e.stderr === 'string';

const getGlobalFolder = () => $.sync`yarn config get globalFolder`.stdout;
const setGlobalFolder = (path: string) =>
  $.sync`yarn config set globalFolder ${path}`;

for await (const [linker, workspaces] of getWorkspacesByLinker()) {
  if (!workspaces.length) continue;

  console.log(`Verify workspaces using ${linker} linker...`);

  workspaces.forEach((workspace) => {
    const run = () => {
      console.log(`Verifying ${workspace.name}...`);
      const { stdout } = install({
        // TODO: convert to yield to use async pipe
        cwd: workspace.location,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          NODE_OPTIONS: ''
        }
      });
      console.log(stdout);
    };
    try {
      run();
    } catch (e1) {
      if (isExecaError(e1) && e1.stderr.includes("code: 'EXDEV'")) {
        console.log(
          'Failed to link to global index. Attempting to migrate index to local project...'
        );
        const globalFolder = getGlobalFolder();
        const root = join(import.meta.dirname, '..');
        const temp = join(root, '.temp');
        const localFolder = join(temp, '.yarn/berry');
        try {
          fs.renameSync(globalFolder, localFolder);
        } catch (e2) {
          if (isArbitaryObject(e2) && e2.code === 'EXDEV') {
            fs.cpSync(globalFolder, localFolder, {
              recursive: true
            });
          } else {
            throw e2;
          }
        }
        setGlobalFolder(localFolder);
        run();
      } else {
        throw e1;
      }
    }
  });
}
