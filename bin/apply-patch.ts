import { readFile, writeFile, unlink } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { $ } from 'commons/esm/bin/utils/functions.js';

import getWorkspaces from './ls-workspaces.ts';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const fetchPkg = async (workspaces: WorkspaceInfo[]) =>
  Promise.all(
    workspaces.map(async (workspace) => {
      const abs = resolve(rootDir, workspace.location, 'package.json');
      let pkg;
      try {
        const content = await readFile(abs, 'utf8');
        pkg = JSON.parse(content);
      } catch {
        console.error(
          `Could not read package.json for workspace at ${workspace.location}`
        );
        process.exit(1);
      }
      return { ...workspace, pkg: pkg ?? {} };
    })
  );

const [rootWorkspace] = await fetchPkg(
  await getWorkspaces({ nodeLinker: ['pnp'], include: ['.'] })
);

interface WorkspaceInfo extends Workspace {
  isPnp?: true;
}

let allWorkspaces = [
  ...(await fetchPkg(
    (
      await getWorkspaces<WorkspaceInfo[]>({
        nodeLinker: ['pnp'],
        exclude: ['.']
      })
    ).map((ws) => ({ ...ws, isPnp: true }))
  )),
  ...(await fetchPkg(
    await getWorkspaces({ nodeLinker: ['node-modules', 'pnpm'] })
  )),
  rootWorkspace
];

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  resolutions?: Record<string, string>;
}

interface PatchResolution {
  dep: string;
  patchedVersion: string;
  patchKey: string;
}

function getPatchResolutions(pkg: PackageJson) {
  const resolutions = pkg.resolutions || {};
  const result = Object.keys(resolutions).reduce<
    Record<string, PatchResolution>
  >((acc, key) => {
    const value = resolutions[key];
    if (value.startsWith('patch:')) {
      const match = key.match(/^(.+)@(?:npm:)?(.+)$/);
      if (match) {
        acc[key] = {
          dep: match[1],
          patchedVersion: match[2],
          patchKey: key
        };
      }
    }
    return acc;
  }, {});
  return Object.values(result);
}

interface PatchCheckResult {
  wsName: string;
  dep: string;
  patchedVersion: string;
  targetVersion: string;
  patchKey: string;
}

const checkPatchResolutions = (
  wsName: string,
  pkg: PackageJson,
  patches: PatchResolution[]
) => {
  const allDeps = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {})
  ]);
  const needsPatch: PatchCheckResult[] = [];
  if (!patches.length || !allDeps.size) return needsPatch;
  for (const { dep, patchedVersion, patchKey } of patches) {
    if (!allDeps.has(dep)) continue;
    const version =
      (pkg.dependencies && pkg.dependencies[dep]) ||
      (pkg.devDependencies && pkg.devDependencies[dep]);
    if (version !== patchedVersion) {
      console.log(
        `[OUTDATED PATCH] ${dep} in [${wsName}]: package.json=${version}, patch=${patchedVersion} (key: ${patchKey})`
      );
      needsPatch.push({
        wsName,
        dep,
        patchedVersion,
        targetVersion: version ?? '',
        patchKey
      });
    }
  }
  return needsPatch;
};

/**
 * Apply the patch for a given outdated dependency using yarn patch and git apply.
 * This function assumes you have a patch file ready at patch.patchFile (add this property to PatchCheckResult if needed).
 */
const applyPatch = async (patch: PatchCheckResult & { patchFile: string }) => {
  // 1. Start a yarn patch for the dependency and capture the patch folder from JSON output
  const stdout = await $(
    `yarn patch ${patch.dep}@npm:${patch.targetVersion} --json`,
    { silent: true }
  );
  // Yarn outputs JSON lines, look for the last JSON object with a 'path' key
  let patchFolder = '';
  const matches = stdout.match(/\{[^}]+\}/g);
  if (matches && matches.length) {
    for (let i = matches.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(matches[i]);
        if (obj.path) {
          patchFolder = obj.path;
          break;
        }
      } catch {}
    }
  }
  if (!patchFolder) {
    throw new Error('Could not determine patch folder from yarn output');
  }

  // 2. Apply the patch file using git apply
  const absPatchFile = resolve(rootDir, patch.patchFile);
  try {
    await $(`git apply "${absPatchFile}"`, { cwd: patchFolder, silent: true });
  } catch (error) {
    console.warn(`A manual patch is required for ${patch.dep}.`);
    throw error;
  }

  // 3. Commit the patch in the correct temp directory
  await $(`yarn patch-commit -s ${patchFolder}`);

  // 4. Refetch updated patched versions after commit
  allWorkspaces = await fetchPkg(allWorkspaces);

  // 5. Delete the old patch file after patch-commit
  try {
    await unlink(absPatchFile);
    console.log(`Deleted old patch file: ${absPatchFile}`);
  } catch (err) {
    console.warn(`Could not delete patch file: ${absPatchFile}`, err);
  }

  // 6. For all workspaces, revert dependency version to original npm version if it was changed to patch:
  let newPatchFile;
  for (const ws of allWorkspaces) {
    const pkg = ws.pkg;
    let changed = false;
    // Check dependencies and devDependencies
    for (const depField of ['dependencies', 'devDependencies'] as const) {
      const field = pkg[depField];
      if (field) {
        if (field[patch.dep]) {
          newPatchFile = field[patch.dep];
          field[patch.dep] = patch.targetVersion;
          changed = true;
        }
      }
    }
    // Update patch resolutions if present, preserving order
    if (pkg.resolutions && pkg.resolutions[patch.patchKey]) {
      let patchPath = newPatchFile;
      if (ws.location !== '.') {
        patchPath = patchPath.replace(
          '~',
          relative(resolve(rootDir, ws.location), rootDir)
        );
      }
      const newKey = `${patch.dep}@npm:${patch.targetVersion}`;
      const newResolutions: Record<string, string> = {};
      for (const [key, value] of Object.entries(pkg.resolutions)) {
        if (key === patch.patchKey) {
          newResolutions[newKey] = patchPath;
        } else if (typeof value === 'string') {
          newResolutions[key] = value;
        }
      }
      pkg.resolutions = newResolutions;
      changed = true;
    }
    if (changed) {
      const pkgPath = resolve(rootDir, ws.location, 'package.json');
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      console.log(
        `Updated ${pkgPath}: reverted ${patch.dep} to version ${patch.targetVersion} and ensured only root has patch resolution.`
      );
    }
  }

  console.log(`Patched ${patch.dep} using yarn patch and git apply.`);
};

const rootPatchResolutions = getPatchResolutions(rootWorkspace.pkg);
const seen = new Set<string>();
const needsPatch = allWorkspaces
  .flatMap((ws) => {
    const combinedPatches = [
      ...rootPatchResolutions,
      ...getPatchResolutions(ws.pkg)
    ];
    return checkPatchResolutions(ws.name, ws.pkg, combinedPatches);
  })
  .filter((patch: PatchCheckResult) => {
    const key = `${patch.dep}::${patch.patchKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

if (!needsPatch.length) {
  console.log('No patch resolutions found.');
  process.exit(0);
}

// Apply patches for all workspaces with outdated patches
let failed = false;
for (const patch of needsPatch) {
  // Try to find the patch file from the root package.json resolutions first
  let resVal = rootWorkspace.pkg.resolutions?.[patch.patchKey];
  // If not found, try the workspace's own resolutions
  if (!resVal) {
    const ws = allWorkspaces.find((w) => w.name === patch.wsName);
    resVal = ws?.pkg.resolutions?.[patch.patchKey];
  }
  const patchFile = resVal?.startsWith('patch:')
    ? resVal.slice(resVal.lastIndexOf('#') + 1)
    : '';
  if (!patchFile) {
    console.error(`Could not determine patch file for ${patch.dep}`);
    continue;
  }
  // Normalize patchFilePath by removing leading '~/' if present
  const patchFilePath = patchFile.replace(/^~\//, '');
  // Always resolve patchFile to absolute path from project root
  try {
    await applyPatch({ ...patch, patchFile: patchFilePath });
  } catch (err) {
    console.warn(`Failed to apply patch for ${patch.dep}:`);
    if (err instanceof Error) {
      console.warn(err.message);
    } else {
      console.warn(err);
    }
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  'All patch resolutions are up to date. Please update the project with `yarn && yarn bootstrap`.'
);
