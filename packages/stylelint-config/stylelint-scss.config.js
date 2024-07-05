import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(process.env.INIT_CWD
    ? import.meta.url
    : path.join(process.cwd(), 'packages/unplugged/node_modules'));
const { flatten, unflatten } = await import(path.join('file://', require.resolve('flat')));
const orderConfig = require('stylelint-config-hudochenkov/order');
const orderConfigPlugins = orderConfig.plugins;
const orderConfigRulesFlat = flatten(orderConfig.rules);
const config = {
    extends: [
        require.resolve('stylelint-config-standard-scss'),
        require.resolve('stylelint-config-prettier-scss')
    ],
    plugins: [
        ...orderConfigPlugins.map((plugin) => typeof plugin === 'string' ? require.resolve(plugin) : plugin)
    ],
    rules: {
        ...unflatten({
            ...orderConfigRulesFlat,
            'order/order.1.severity': 'error',
            'order/properties-order.1.severity': 'error'
        })
    },
    allowEmptyInput: true
};
export default config;
