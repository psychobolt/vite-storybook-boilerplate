import { resolveConfig, formatTask } from 'commons/esm/lint-staged.config.js';

const format = formatTask(import.meta.dirname);

export default resolveConfig(import.meta.dirname)({
  '!(.apm/**/*|apm.yml)': format,
  '{.apm/**/*,apm.yml}': async (filenames) => {
    const tasks = await format(filenames);
    return [
      ...(typeof tasks === 'string' ? [tasks] : tasks),
      'apm install',
      'git add apm.lock.yaml'
    ];
  }
});
