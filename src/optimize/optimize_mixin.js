"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// @ts-ignore not TS yet
const fs_optimizer_1 = tslib_1.__importDefault(require("./fs_optimizer"));
const bundles_route_1 = require("./bundles_route");
// @ts-ignore not TS yet
const dynamic_dll_plugin_1 = require("./dynamic_dll_plugin");
const utils_1 = require("../core/server/utils");
const np_ui_plugin_public_dirs_1 = require("./np_ui_plugin_public_dirs");
exports.optimizeMixin = async (kbnServer, server, config) => {
    if (!config.get('optimize.enabled'))
        return;
    // the watch optimizer sets up two threads, one is the server listening
    // on 5601 and the other is a server listening on 5602 that builds the
    // bundles in a "middleware" style.
    //
    // the server listening on 5601 may be restarted a number of times, depending
    // on the watch setup managed by the cli. It proxies all bundles/* and built_assets/dlls/*
    // requests to the other server. The server on 5602 is long running, in order
    // to prevent complete rebuilds of the optimize content.
    const watch = config.get('optimize.watch');
    if (watch) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return await kbnServer.mixin(require('./watch/watch'));
    }
    const { uiBundles } = kbnServer;
    server.route(bundles_route_1.createBundlesRoute({
        regularBundlesPath: uiBundles.getWorkingDir(),
        dllBundlesPath: dynamic_dll_plugin_1.DllCompiler.getRawDllConfig().outputPath,
        basePublicPath: config.get('server.basePath'),
        builtCssPath: utils_1.fromRoot('built_assets/css'),
        npUiPluginPublicDirs: np_ui_plugin_public_dirs_1.getNpUiPluginPublicDirs(kbnServer),
        buildHash: kbnServer.newPlatform.env.packageInfo.buildNum.toString(),
        isDist: kbnServer.newPlatform.env.packageInfo.dist,
    }));
    // in prod, only bundle when something is missing or invalid
    const reuseCache = config.get('optimize.useBundleCache')
        ? await uiBundles.areAllBundleCachesValid()
        : false;
    // we might not have any work to do
    if (reuseCache) {
        server.log(['debug', 'optimize'], `All bundles are cached and ready to go!`);
        return;
    }
    await uiBundles.resetBundleDir();
    // only require the FsOptimizer when we need to
    const optimizer = new fs_optimizer_1.default({
        logWithMetadata: server.logWithMetadata,
        uiBundles,
        profile: config.get('optimize.profile'),
        sourceMaps: config.get('optimize.sourceMaps'),
        workers: config.get('optimize.workers'),
    });
    server.log(['info', 'optimize'], `Optimizing and caching ${uiBundles.getDescription()}. This may take a few minutes`);
    const start = Date.now();
    await optimizer.run();
    const seconds = ((Date.now() - start) / 1000).toFixed(2);
    server.log(['info', 'optimize'], `Optimization of ${uiBundles.getDescription()} complete in ${seconds} seconds`);
};
