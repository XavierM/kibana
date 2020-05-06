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
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const os_1 = tslib_1.__importDefault(require("os"));
const del_1 = tslib_1.__importDefault(require("del"));
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const js_yaml_1 = require("js-yaml");
const read_config_1 = require("../../../core/server/config/read_config");
const legacyConfig = follow('__fixtures__/reload_logging_config/kibana.test.yml');
const configFileLogConsole = follow('__fixtures__/reload_logging_config/kibana_log_console.test.yml');
const configFileLogFile = follow('__fixtures__/reload_logging_config/kibana_log_file.test.yml');
const kibanaPath = follow('../../../../scripts/kibana.js');
const second = 1000;
const minute = second * 60;
const tempDir = path_1.default.join(os_1.default.tmpdir(), 'kbn-reload-test');
function follow(file) {
    return path_1.default.relative(process.cwd(), path_1.default.resolve(__dirname, file));
}
function watchFileUntil(path, matcher, timeout) {
    return new Promise((resolve, reject) => {
        const timeoutHandle = setTimeout(() => {
            fs_1.default.unwatchFile(path);
            reject(`watchFileUntil timed out for "${matcher}"`);
        }, timeout);
        fs_1.default.watchFile(path, () => {
            try {
                const contents = fs_1.default.readFileSync(path, 'utf-8');
                if (matcher.test(contents)) {
                    clearTimeout(timeoutHandle);
                    fs_1.default.unwatchFile(path);
                    resolve(contents);
                }
            }
            catch (e) {
                // noop
            }
        });
    });
}
function containsJsonOnly(content) {
    return content.every(line => line.startsWith('{'));
}
function createConfigManager(configPath) {
    return {
        modify(fn) {
            const oldContent = read_config_1.getConfigFromFiles([configPath]);
            const yaml = js_yaml_1.safeDump(fn(oldContent));
            fs_1.default.writeFileSync(configPath, yaml);
        },
    };
}
describe('Server logging configuration', function () {
    let child;
    beforeEach(() => {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    });
    afterEach(async () => {
        if (child !== undefined) {
            const exitPromise = new Promise(resolve => child?.once('exit', resolve));
            child.kill('SIGKILL');
            await exitPromise;
        }
        del_1.default.sync(tempDir, { force: true });
    });
    if (process.platform.startsWith('win')) {
        it('SIGHUP is not a feature of Windows.', () => {
            // nothing to do for Windows
        });
        return;
    }
    describe('legacy logging', () => {
        it('should be reloadable via SIGHUP process signaling', async function () {
            const configFilePath = path_1.default.resolve(tempDir, 'kibana.yml');
            fs_1.default.copyFileSync(legacyConfig, configFilePath);
            child = child_process_1.default.spawn(process.execPath, [
                kibanaPath,
                '--oss',
                '--config',
                configFilePath,
                '--verbose',
            ]);
            const message$ = Rx.fromEvent(child.stdout, 'data').pipe(operators_1.map(messages => String(messages)
                .split('\n')
                .filter(Boolean)));
            await message$
                .pipe(
            // We know the sighup handler will be registered before this message logged
            operators_1.filter(messages => messages.some(m => m.includes('setting up root'))), operators_1.take(1))
                .toPromise();
            const lastMessage = await message$.pipe(operators_1.take(1)).toPromise();
            expect(containsJsonOnly(lastMessage)).toBe(true);
            createConfigManager(configFilePath).modify(oldConfig => {
                oldConfig.logging.json = false;
                return oldConfig;
            });
            child.kill('SIGHUP');
            await message$
                .pipe(operators_1.filter(messages => !containsJsonOnly(messages)), operators_1.take(1))
                .toPromise();
        }, minute);
        it('should recreate file handle on SIGHUP', async function () {
            const logPath = path_1.default.resolve(tempDir, 'kibana.log');
            const logPathArchived = path_1.default.resolve(tempDir, 'kibana_archive.log');
            child = child_process_1.default.spawn(process.execPath, [
                kibanaPath,
                '--oss',
                '--config',
                legacyConfig,
                '--logging.dest',
                logPath,
                '--verbose',
            ]);
            await watchFileUntil(logPath, /setting up root/, 30 * second);
            // once the server is running, archive the log file and issue SIGHUP
            fs_1.default.renameSync(logPath, logPathArchived);
            child.kill('SIGHUP');
            await watchFileUntil(logPath, /Reloaded logging configuration due to SIGHUP/, 30 * second);
        }, minute);
    });
    describe('platform logging', () => {
        it('should be reloadable via SIGHUP process signaling', async function () {
            const configFilePath = path_1.default.resolve(tempDir, 'kibana.yml');
            fs_1.default.copyFileSync(configFileLogConsole, configFilePath);
            child = child_process_1.default.spawn(process.execPath, [kibanaPath, '--oss', '--config', configFilePath]);
            const message$ = Rx.fromEvent(child.stdout, 'data').pipe(operators_1.map(messages => String(messages)
                .split('\n')
                .filter(Boolean)));
            await message$
                .pipe(
            // We know the sighup handler will be registered before this message logged
            operators_1.filter(messages => messages.some(m => m.includes('setting up root'))), operators_1.take(1))
                .toPromise();
            const lastMessage = await message$.pipe(operators_1.take(1)).toPromise();
            expect(containsJsonOnly(lastMessage)).toBe(true);
            createConfigManager(configFilePath).modify(oldConfig => {
                oldConfig.logging.appenders.console.layout.kind = 'pattern';
                return oldConfig;
            });
            child.kill('SIGHUP');
            await message$
                .pipe(operators_1.filter(messages => !containsJsonOnly(messages)), operators_1.take(1))
                .toPromise();
        }, 30 * second);
        it('should recreate file handle on SIGHUP', async function () {
            const configFilePath = path_1.default.resolve(tempDir, 'kibana.yml');
            fs_1.default.copyFileSync(configFileLogFile, configFilePath);
            const logPath = path_1.default.resolve(tempDir, 'kibana.log');
            const logPathArchived = path_1.default.resolve(tempDir, 'kibana_archive.log');
            createConfigManager(configFilePath).modify(oldConfig => {
                oldConfig.logging.appenders.file.path = logPath;
                return oldConfig;
            });
            child = child_process_1.default.spawn(process.execPath, [kibanaPath, '--oss', '--config', configFilePath]);
            await watchFileUntil(logPath, /setting up root/, 30 * second);
            // once the server is running, archive the log file and issue SIGHUP
            fs_1.default.renameSync(logPath, logPathArchived);
            child.kill('SIGHUP');
            await watchFileUntil(logPath, /Reloaded logging configuration due to SIGHUP/, 30 * second);
        }, minute);
    });
});
