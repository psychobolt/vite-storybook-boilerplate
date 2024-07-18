import { require, resolvePlugins } from '../utils/functions.js';

export default resolvePlugins(
  require('stylelint-config-hudochenkov/order').plugins
);
