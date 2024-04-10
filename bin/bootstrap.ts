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

const getCacheFolder = (options: SyncOptions) =>
  $(options).sync`yarn config get cacheFolder`.stdout;
const setGlobalFolder = (path: string) =>
  $.sync`yarn config set globalFolder ${path}`;

for await (const [linker, workspaces] of getWorkspacesByLinker()) {
  if (!workspaces.length) continue;

  console.log(`Verify workspaces using ${linker} linker...`);

  workspaces.forEach((workspace) => {
    const options = { cwd: workspace.location };
    const run = () => {
      console.log(`Verifying ${workspace.name}...`);
      // TODO: convert to $.sync
      // TODO: convert to yield to use async pipe
      const { stdout } = install({
        ...options,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          NODE_OPTIONS: ''
        }
      });
      console.log(stdout);
    };
    try {
      run();
    } catch (e) {
      if (isExecaError(e) && e.stderr.includes("code: 'EXDEV'")) {
        console.log(
          'Failed to link to global index. Attempting to migrate cache to shared project...'
        );
        const root = join(import.meta.dirname, '..');
        const temp = join(root, '.temp');
        const sharedFolder = join(temp, '.yarn/berry');
        const sharedCacheFolder = join(sharedFolder, 'cache');
        const cacheFolder = getCacheFolder(options);
        if (
          $(options).sync`yarn config get enableGlobalCache`.stdout === 'false'
        ) {
          fs.renameSync(cacheFolder, sharedCacheFolder);
        } else {
          fs.cpSync(cacheFolder, sharedCacheFolder, {
            recursive: true
          });
        }
        setGlobalFolder(sharedFolder);
        console.log('Cleaning node_modules...');
        fs.rmSync(join(workspace.location, 'node_modules'), {
          recursive: true
        });
        run();
      } else {
        throw e;
      }
    }
  });
}
