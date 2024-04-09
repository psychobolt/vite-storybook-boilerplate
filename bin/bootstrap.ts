import fs from 'fs';
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

const getGlobalFolder = () => $.sync`yarn config get globalFolder`.stdout;
const setGlobalFolder = (path: string) =>
  $.sync`yarn config set globalFolder ${path}`;

for await (const [linker, workspaces] of getWorkspacesByLinker()) {
  if (!workspaces.length) continue;

  console.log(`Verify workspaces using ${linker} linker...`);

  if (linker === 'pnpm') {
    console.log('Verifying global index linking...');
    const globalFolder = getGlobalFolder();
    const indexFile = 'dummy.dat';
    const indexPath = join(globalFolder, indexFile);
    const indexURL = new URL(indexPath, 'file://');
    const root = join(import.meta.dirname, '..');
    const temp = join(root, 'temp');
    const link = join(temp, indexFile);
    if (!fs.existsSync(temp)) fs.mkdirSync(temp);
    fs.writeFileSync(indexPath, '');
    try {
      fs.symlinkSync(indexURL.href, link);
      fs.unlinkSync(link);
    } catch (e) {
      console.log(
        'Failed to link to global folder. Attempting to migrate to local folder...'
      );
      const localFolder = join(temp, '.yarn/berry');
      setGlobalFolder(localFolder);
      console.log('Copying cache files to local folder...');
      fs.cpSync(globalFolder, localFolder, { recursive: true });
    }
    fs.rmSync(indexURL);
    if (!fs.readdirSync(temp).length) fs.rmSync(temp, { recursive: true });
    console.log('Global index link was successful. Test files are cleaned up!');
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
