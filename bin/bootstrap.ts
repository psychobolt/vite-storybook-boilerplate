import { homedir } from 'os';
import { symlinkSync, unlinkSync, cpSync } from 'fs';
import { join } from 'path';
import { $, execaSync } from 'execa';
import type { SyncOptions } from 'execa';
import getWorkspaces from './ls-workspaces.ts';

const argv = process.argv.slice(2);
const yarnCmd = (args: string[], options?: SyncOptions) =>
  execaSync('yarn', args, { stdio: 'inherit', ...options });
const install = (options?: SyncOptions) =>
  yarnCmd(['install', ...argv], options);

async function* getWorkspacesByLinker() {
  for (const linker of ['pnpm', 'node-modules']) {
    const result: [string, Workspace[]] = [
      linker,
      await getWorkspaces<Workspace[]>({
        nodeLinker: [linker]
      })
    ];
    yield result;
  }
}

const getGlobalFolder = () => $.sync`yarn config get globalFolder`.stdout;
const setGlobalFolder = (path: string) =>
  $.sync`yarn config set globalFolder "${path}"`;

for await (const [linker, workspaces] of getWorkspacesByLinker()) {
  if (!workspaces.length) continue;

  console.log(`Verify workspaces using ${linker} linker...`);

  if (linker === 'pnpm') {
    const testPath = join(homedir(), '.nvmrc');
    try {
      symlinkSync(join(import.meta.dirname, '../.nvmrc'), testPath);
      unlinkSync(testPath);
    } catch (e) {
      console.log(
        'Failed to link to home dir. Attempting to migrate to local cache...'
      );
      const globalFolder = getGlobalFolder();
      const temp = join(import.meta.dirname, '../temp/.yarn/berry');
      setGlobalFolder(temp);
      console.log('Copying cache files to new global folder...');
      cpSync(globalFolder, temp, { recursive: true });
    }
  }

  workspaces.forEach((workspace) => {
    console.log(`Verifying ${workspace.name}...`);
    install({
      cwd: workspace.location,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        NODE_OPTIONS: ''
      }
    });
  });
}
