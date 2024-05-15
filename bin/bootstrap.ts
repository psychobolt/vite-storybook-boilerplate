import fs from 'node:fs';
import { join } from 'node:path';
import { execSync, type ExecSyncOptions } from 'node:child_process';
import { $ } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const install = (options?: ExecSyncOptions) =>
  execSync('yarn install', options).toString();

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

const getCacheFolder = (options: ExecSyncOptions) =>
  execSync('yarn config get cacheFolder', options).toString();
const setGlobalFolder = (path: string) =>
  execSync(`yarn config set globalFolder ${path}`);

for await (const [linker, workspaces] of getWorkspacesByLinker()) {
  if (!workspaces.length) continue;

  console.log(`Verify workspaces using ${linker} linker...`);

  workspaces.forEach((workspace) => {
    const options = { cwd: workspace.location };
    const run = () => {
      console.log(`Verifying ${workspace.name}...`);
      // TODO: convert to yield to use async pipe
      const stdout = install(options);
      console.log(stdout);
    };
    try {
      run();
    } catch (e) {
      if (isExecaError(e) && e.stderr.includes("code: 'EXDEV'")) {
        console.log(
          'Failed to link to global index. Attempting to migrate global cache to shared project...'
        );
        const root = join(import.meta.dirname, '..');
        const temp = join(root, '.temp');
        const sharedFolder = join(temp, '.yarn/berry');
        const sharedCacheFolder = join(sharedFolder, 'cache');
        if (!fs.existsSync(sharedCacheFolder)) {
          console.log('Copying global cache...');
          const cacheFolder = getCacheFolder(options);
          if (
            $(options).sync`yarn config get enableGlobalCache`.stdout ===
            'false'
          ) {
            fs.renameSync(cacheFolder, sharedCacheFolder);
          } else {
            fs.cpSync(cacheFolder, sharedCacheFolder, {
              recursive: true
            });
          }
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
