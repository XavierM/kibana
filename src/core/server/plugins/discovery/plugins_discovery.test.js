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
const plugins_discovery_test_mocks_1 = require("./plugins_discovery.test.mocks");
const raw_config_service_mock_1 = require("../../config/raw_config_service.mock");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const path_1 = require("path");
const operators_1 = require("rxjs/operators");
const config_1 = require("../../config");
const env_1 = require("../../config/__mocks__/env");
const plugin_1 = require("../plugin");
const plugins_config_1 = require("../plugins_config");
const plugins_discovery_1 = require("./plugins_discovery");
const TEST_PLUGIN_SEARCH_PATHS = {
    nonEmptySrcPlugins: path_1.resolve(process.cwd(), 'src', 'plugins'),
    emptyPlugins: path_1.resolve(process.cwd(), 'plugins'),
    nonExistentKibanaExtra: path_1.resolve(process.cwd(), '..', 'kibana-extra'),
};
const TEST_EXTRA_PLUGIN_PATH = path_1.resolve(process.cwd(), 'my-extra-plugin');
const logger = logging_service_mock_1.loggingServiceMock.create();
beforeEach(() => {
    plugins_discovery_test_mocks_1.mockReaddir.mockImplementation((path, cb) => {
        if (path === TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins) {
            cb(null, [
                '1',
                '2-no-manifest',
                '3',
                '4-incomplete-manifest',
                '5-invalid-manifest',
                '6',
                '7-non-dir',
                '8-incompatible-manifest',
                '9-inaccessible-dir',
            ]);
        }
        else if (path === TEST_PLUGIN_SEARCH_PATHS.nonExistentKibanaExtra) {
            cb(new Error('ENOENT'));
        }
        else {
            cb(null, []);
        }
    });
    plugins_discovery_test_mocks_1.mockStat.mockImplementation((path, cb) => {
        if (path.includes('9-inaccessible-dir')) {
            cb(new Error(`ENOENT (disappeared between "readdir" and "stat").`));
        }
        else {
            cb(null, { isDirectory: () => !path.includes('non-dir') });
        }
    });
    plugins_discovery_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        if (path.includes('no-manifest')) {
            cb(new Error('ENOENT'));
        }
        else if (path.includes('invalid-manifest')) {
            cb(null, Buffer.from('not-json'));
        }
        else if (path.includes('incomplete-manifest')) {
            cb(null, Buffer.from(JSON.stringify({ version: '1' })));
        }
        else if (path.includes('incompatible-manifest')) {
            cb(null, Buffer.from(JSON.stringify({ id: 'plugin', version: '1' })));
        }
        else {
            cb(null, Buffer.from(JSON.stringify({
                id: 'plugin',
                configPath: ['core', 'config'],
                version: '1',
                kibanaVersion: '1.2.3',
                requiredPlugins: ['a', 'b'],
                optionalPlugins: ['c', 'd'],
                server: true,
            })));
        }
    });
});
afterEach(() => {
    jest.clearAllMocks();
});
test('properly iterates through plugin search locations', async () => {
    plugins_discovery_test_mocks_1.mockPackage.raw = {
        branch: 'master',
        version: '1.2.3',
        build: {
            distributable: true,
            number: 1,
            sha: '',
        },
    };
    const env = config_1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { envName: 'development' },
    }));
    const configService = new config_1.ConfigService(raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { plugins: { paths: [TEST_EXTRA_PLUGIN_PATH] } } }), env, logger);
    await configService.setSchema(plugins_config_1.config.path, plugins_config_1.config.schema);
    const rawConfig = await configService
        .atPath('plugins')
        .pipe(operators_1.first())
        .toPromise();
    const { plugin$, error$ } = plugins_discovery_1.discover(new plugins_config_1.PluginsConfig(rawConfig, env), {
        coreId: Symbol(),
        configService,
        env,
        logger,
    });
    const plugins = await plugin$.pipe(operators_1.toArray()).toPromise();
    expect(plugins).toHaveLength(4);
    for (const path of [
        path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '1'),
        path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '3'),
        path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '6'),
        TEST_EXTRA_PLUGIN_PATH,
    ]) {
        const discoveredPlugin = plugins.find(plugin => plugin.path === path);
        expect(discoveredPlugin).toBeInstanceOf(plugin_1.PluginWrapper);
        expect(discoveredPlugin.configPath).toEqual(['core', 'config']);
        expect(discoveredPlugin.requiredPlugins).toEqual(['a', 'b']);
        expect(discoveredPlugin.optionalPlugins).toEqual(['c', 'd']);
    }
    await expect(error$
        .pipe(operators_1.map(error => error.toString()), operators_1.toArray())
        .toPromise()).resolves.toEqual([
        `Error: ENOENT (disappeared between "readdir" and "stat"). (invalid-plugin-path, ${path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '9-inaccessible-dir')})`,
        `Error: ENOENT (invalid-search-path, ${TEST_PLUGIN_SEARCH_PATHS.nonExistentKibanaExtra})`,
        `Error: ENOENT (missing-manifest, ${path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '2-no-manifest', 'kibana.json')})`,
        `Error: Plugin manifest must contain an "id" property. (invalid-manifest, ${path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '4-incomplete-manifest', 'kibana.json')})`,
        `Error: Unexpected token o in JSON at position 1 (invalid-manifest, ${path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '5-invalid-manifest', 'kibana.json')})`,
        `Error: Plugin "plugin" is only compatible with Kibana version "1", but used Kibana version is "1.2.3". (incompatible-version, ${path_1.resolve(TEST_PLUGIN_SEARCH_PATHS.nonEmptySrcPlugins, '8-incompatible-manifest', 'kibana.json')})`,
    ]);
});
test('logs a warning about --plugin-path when used in development', async () => {
    plugins_discovery_test_mocks_1.mockPackage.raw = {
        branch: 'master',
        version: '1.2.3',
        build: {
            distributable: true,
            number: 1,
            sha: '',
        },
    };
    const env = config_1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { dev: false, envName: 'development' },
    }));
    const configService = new config_1.ConfigService(raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { plugins: { paths: [TEST_EXTRA_PLUGIN_PATH] } } }), env, logger);
    await configService.setSchema(plugins_config_1.config.path, plugins_config_1.config.schema);
    const rawConfig = await configService
        .atPath('plugins')
        .pipe(operators_1.first())
        .toPromise();
    plugins_discovery_1.discover(new plugins_config_1.PluginsConfig(rawConfig, env), {
        coreId: Symbol(),
        configService,
        env,
        logger,
    });
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toEqual([
        [
            `Explicit plugin paths [${TEST_EXTRA_PLUGIN_PATH}] should only be used in development. Relative imports may not work properly in production.`,
        ],
    ]);
});
test('does not log a warning about --plugin-path when used in production', async () => {
    plugins_discovery_test_mocks_1.mockPackage.raw = {
        branch: 'master',
        version: '1.2.3',
        build: {
            distributable: true,
            number: 1,
            sha: '',
        },
    };
    const env = config_1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { dev: false, envName: 'production' },
    }));
    const configService = new config_1.ConfigService(raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { plugins: { paths: [TEST_EXTRA_PLUGIN_PATH] } } }), env, logger);
    await configService.setSchema(plugins_config_1.config.path, plugins_config_1.config.schema);
    const rawConfig = await configService
        .atPath('plugins')
        .pipe(operators_1.first())
        .toPromise();
    plugins_discovery_1.discover(new plugins_config_1.PluginsConfig(rawConfig, env), {
        coreId: Symbol(),
        configService,
        env,
        logger,
    });
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toEqual([]);
});
