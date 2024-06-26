import { execSync } from 'node:child_process';
import { createRequire, register } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const swcRegisterPath = `file://${execSync('yarn g:swc-register-path')
  .toString()
  .slice(0, -1)}`;

register(swcRegisterPath, pathToFileURL('./').toString());
