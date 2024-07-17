import type { ProcessOptions, AcceptedPlugin } from 'postcss';
import pseudoClasses from 'postcss-pseudo-classes';

type Config = ProcessOptions & { plugins?: AcceptedPlugin[] };

const config: Config = {
  plugins: [
    pseudoClasses({
      blacklist: [':not', ':nth-child', ':last-child', ':checked']
    })
  ]
};

export default config;
