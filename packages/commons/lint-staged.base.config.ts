import type { Configuration } from 'lint-staged';

const config: Configuration = {
  '*': (filenames) => {
    const formatFilenames = filenames.filter(
      (filename) => !filename.endsWith('.pem')
    );
    return formatFilenames.length > 0
      ? `yarn format -- ${formatFilenames.join(' ')}`
      : [];
  }
};

export default config;
