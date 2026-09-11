import { type GenerateTask, defineConfig } from 'lint-staged/config';

export const formatTask =
  (cwd: string): GenerateTask =>
  (filenames) =>
    `yarn exec 'cd ${cwd.replace(/\\/g, '/')} && yarn format -- ${filenames.join(' ')}'`;

export const resolveConfig =
  (cwd: string) =>
  (config = defineConfig({ '*': formatTask(cwd) })) =>
    defineConfig(config);

export default resolveConfig(import.meta.dirname)();
