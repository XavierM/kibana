"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const new_platform_1 = require("ui/new_platform");
const plugin_1 = require("../../../../../../plugins/vis_type_table/public/plugin");
const plugins = {
    expressions: new_platform_1.npSetup.plugins.expressions,
    visualizations: new_platform_1.npSetup.plugins.visualizations,
};
const pluginInstance = new plugin_1.TableVisPlugin({});
exports.setup = pluginInstance.setup(new_platform_1.npSetup.core, plugins);
exports.start = pluginInstance.start(new_platform_1.npStart.core, {
    data: new_platform_1.npStart.plugins.data,
});
