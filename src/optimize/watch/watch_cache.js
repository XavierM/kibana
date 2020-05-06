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
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const path_2 = tslib_1.__importDefault(require("path"));
const del_1 = tslib_1.__importDefault(require("del"));
const normalize_path_1 = tslib_1.__importDefault(require("normalize-path"));
const readAsync = util_1.promisify(fs_1.readFile);
const writeAsync = util_1.promisify(fs_1.writeFile);
const readdirAsync = util_1.promisify(fs_1.readdir);
const unlinkAsync = util_1.promisify(fs_1.unlink);
const rmdirAsync = util_1.promisify(fs_1.rmdir);
class WatchCache {
    constructor(params) {
        this.logWithMetadata = params.logWithMetadata;
        this.outputPath = params.outputPath;
        this.dllsPath = params.dllsPath;
        this.cachePath = params.cachePath;
        this.isInitialized = false;
        this.statePath = '';
        this.cacheState = {};
        this.diskCacheState = {};
        this.cacheState.yarnLockSha = '';
        this.cacheState.optimizerConfigSha = '';
    }
    async tryInit() {
        if (!this.isInitialized) {
            this.statePath = path_1.resolve(this.outputPath, 'watch_optimizer_cache_state.json');
            this.diskCacheState = await this.read();
            this.cacheState.yarnLockSha = await this.buildYarnLockSha();
            this.cacheState.optimizerConfigSha = await this.buildOptimizerConfigSha();
            this.isInitialized = true;
        }
    }
    async tryReset() {
        await this.tryInit();
        if (!this.isResetNeeded()) {
            return;
        }
        await this.reset();
    }
    async reset() {
        this.logWithMetadata(['info', 'optimize:watch_cache'], 'The optimizer watch cache will reset');
        // start by deleting the state file to lower the
        // amount of time that another process might be able to
        // successfully read it once we decide to delete it
        await del_1.default(this.statePath, { force: true });
        // delete everything in optimize/.cache directory
        await recursiveDelete(normalize_path_1.default(this.cachePath));
        // delete dlls
        await del_1.default(this.dllsPath);
        // re-write new cache state file
        await this.write();
        this.logWithMetadata(['info', 'optimize:watch_cache'], 'The optimizer watch cache has reset');
    }
    async buildShaWithMultipleFiles(filePaths) {
        const shaHash = crypto_1.createHash('sha1');
        for (const filePath of filePaths) {
            try {
                shaHash.update(await readAsync(filePath, 'utf8'), 'utf8');
            }
            catch (e) {
                /* no-op */
            }
        }
        return shaHash.digest('hex');
    }
    async buildYarnLockSha() {
        const kibanaYarnLock = path_1.resolve(__dirname, '../../../yarn.lock');
        return await this.buildShaWithMultipleFiles([kibanaYarnLock]);
    }
    async buildOptimizerConfigSha() {
        const baseOptimizer = path_1.resolve(__dirname, '../base_optimizer.js');
        const dynamicDllConfigModel = path_1.resolve(__dirname, '../dynamic_dll_plugin/dll_config_model.js');
        const dynamicDllPlugin = path_1.resolve(__dirname, '../dynamic_dll_plugin/dynamic_dll_plugin.js');
        return await this.buildShaWithMultipleFiles([
            baseOptimizer,
            dynamicDllConfigModel,
            dynamicDllPlugin,
        ]);
    }
    isResetNeeded() {
        return this.hasYarnLockChanged() || this.hasOptimizerConfigChanged();
    }
    hasYarnLockChanged() {
        return this.cacheState.yarnLockSha !== this.diskCacheState.yarnLockSha;
    }
    hasOptimizerConfigChanged() {
        return this.cacheState.optimizerConfigSha !== this.diskCacheState.optimizerConfigSha;
    }
    async write() {
        await writeAsync(this.statePath, JSON.stringify(this.cacheState, null, 2), 'utf8');
        this.diskCacheState = this.cacheState;
    }
    async read() {
        try {
            return JSON.parse(await readAsync(this.statePath, 'utf8'));
        }
        catch (error) {
            return {};
        }
    }
}
exports.WatchCache = WatchCache;
/**
 * Recursively deletes a folder. This is a workaround for a bug in `del` where
 * very large folders (with 84K+ files) cause a stack overflow.
 */
async function recursiveDelete(directory) {
    try {
        const entries = await readdirAsync(directory, { withFileTypes: true });
        await Promise.all(entries.map(entry => {
            const absolutePath = path_2.default.join(directory, entry.name);
            return entry.isDirectory() ? recursiveDelete(absolutePath) : unlinkAsync(absolutePath);
        }));
        return rmdirAsync(directory);
    }
    catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}
