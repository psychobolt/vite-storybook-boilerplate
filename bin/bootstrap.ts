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

const slash = (path: string) => path.replace(/\\/g, '/').replace(':/', '://');
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
      return stdout;
    };
    let stdout = '';
    try {
      stdout = run();
    } catch (e) {
      if (stdout.includes("code: 'EXDEV'")) {
        console.log(
          'Failed to link to global index. Attempting to migrate index to local project...'
        );
        const globalFolder = getGlobalFolder();
        const root = slash(join(import.meta.dirname, '..'));
        const temp = slash(join(root, 'temp'));
        const localFolder = slash(join(temp, '.yarn/berry'));
        setGlobalFolder(localFolder);
        fs.cpSync(globalFolder, localFolder, { recursive: true });
        run();
      } else {
        throw e;
      }
    }
  });
}
