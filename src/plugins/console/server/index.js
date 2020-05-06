"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const plugin_1 = require("./plugin");
exports.plugin = (ctx) => new plugin_1.ConsoleServerPlugin(ctx);
exports.config = {
    deprecations: ({ unused }) => [unused('ssl')],
    schema: config_1.config,
};
