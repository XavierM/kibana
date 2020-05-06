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
const plugin_discovery_error_1 = require("./plugin_discovery_error");
const plugin_manifest_parser_test_mocks_1 = require("./plugin_manifest_parser.test.mocks");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const path_1 = require("path");
const plugin_manifest_parser_1 = require("./plugin_manifest_parser");
const logger = logging_service_mock_1.loggingServiceMock.createLogger();
const pluginPath = path_1.resolve('path', 'existent-dir');
const pluginManifestPath = path_1.resolve(pluginPath, 'kibana.json');
const packageInfo = {
    branch: 'master',
    buildNum: 1,
    buildSha: '',
    version: '7.0.0-alpha1',
    dist: false,
};
afterEach(() => {
    jest.clearAllMocks();
});
test('return error when manifest is empty', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(''));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Unexpected end of JSON input (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when manifest content is null', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from('null'));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin manifest must contain a JSON encoded object. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when manifest content is not a valid JSON', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from('not-json'));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Unexpected token o in JSON at position 1 (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when plugin id is missing', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ version: 'some-version' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin manifest must contain an "id" property. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when plugin id includes `.` characters', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'some.name', version: 'some-version' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin "id" must not include \`.\` characters. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('logs warning if pluginId is not in camelCase format', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'some_name', version: 'kibana', server: true })));
    });
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toHaveLength(0);
    await plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger);
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toMatchInlineSnapshot(`
    Array [
      Array [
        "Expect plugin \\"id\\" in camelCase, but found: some_name",
      ],
    ]
  `);
});
test('return error when plugin version is missing', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin manifest for "someId" must contain a "version" property. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when plugin expected Kibana version is lower than actual version', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '6.4.2' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin "someId" is only compatible with Kibana version "6.4.2", but used Kibana version is "7.0.0-alpha1". (incompatible-version, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.IncompatibleVersion,
        path: pluginManifestPath,
    });
});
test('return error when plugin expected Kibana version cannot be interpreted as semver', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '1.0.0', kibanaVersion: 'non-sem-ver' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin "someId" is only compatible with Kibana version "non-sem-ver", but used Kibana version is "7.0.0-alpha1". (incompatible-version, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.IncompatibleVersion,
        path: pluginManifestPath,
    });
});
test('return error when plugin config path is not a string', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.0', configPath: 2 })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `The "configPath" in plugin manifest for "someId" should either be a string or an array of strings. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when plugin config path is an array that contains non-string values', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.0', configPath: ['config', 2] })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `The "configPath" in plugin manifest for "someId" should either be a string or an array of strings. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when plugin expected Kibana version is higher than actual version', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.1' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Plugin "someId" is only compatible with Kibana version "7.0.1", but used Kibana version is "7.0.0-alpha1". (incompatible-version, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.IncompatibleVersion,
        path: pluginManifestPath,
    });
});
test('return error when both `server` and `ui` are set to `false` or missing', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.0' })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Both "server" and "ui" are missing or set to "false" in plugin manifest for "someId", but at least one of these must be set to "true". (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.0', server: false, ui: false })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Both "server" and "ui" are missing or set to "false" in plugin manifest for "someId", but at least one of these must be set to "true". (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
test('return error when manifest contains unrecognized properties', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({
            id: 'someId',
            version: '7.0.0',
            server: true,
            unknownOne: 'one',
            unknownTwo: true,
        })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).rejects.toMatchObject({
        message: `Manifest for plugin "someId" contains the following unrecognized properties: unknownOne,unknownTwo. (invalid-manifest, ${pluginManifestPath})`,
        type: plugin_discovery_error_1.PluginDiscoveryErrorType.InvalidManifest,
        path: pluginManifestPath,
    });
});
describe('configPath', () => {
    test('falls back to plugin id if not specified', async () => {
        plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
            cb(null, Buffer.from(JSON.stringify({ id: 'plugin', version: '7.0.0', server: true })));
        });
        const manifest = await plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger);
        expect(manifest.configPath).toBe(manifest.id);
    });
    test('falls back to plugin id in snakeCase format', async () => {
        plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
            cb(null, Buffer.from(JSON.stringify({ id: 'SomeId', version: '7.0.0', server: true })));
        });
        const manifest = await plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger);
        expect(manifest.configPath).toBe('some_id');
    });
    test('not formated to snakeCase if defined explicitly as string', async () => {
        plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
            cb(null, Buffer.from(JSON.stringify({ id: 'someId', configPath: 'somePath', version: '7.0.0', server: true })));
        });
        const manifest = await plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger);
        expect(manifest.configPath).toBe('somePath');
    });
    test('not formated to snakeCase if defined explicitly as an array of strings', async () => {
        plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
            cb(null, Buffer.from(JSON.stringify({ id: 'someId', configPath: ['somePath'], version: '7.0.0', server: true })));
        });
        const manifest = await plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger);
        expect(manifest.configPath).toEqual(['somePath']);
    });
});
test('set defaults for all missing optional fields', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({ id: 'someId', version: '7.0.0', server: true })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).resolves.toEqual({
        id: 'someId',
        configPath: 'some_id',
        version: '7.0.0',
        kibanaVersion: '7.0.0',
        optionalPlugins: [],
        requiredPlugins: [],
        server: true,
        ui: false,
    });
});
test('return all set optional fields as they are in manifest', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({
            id: 'someId',
            configPath: ['some', 'path'],
            version: 'some-version',
            kibanaVersion: '7.0.0',
            requiredPlugins: ['some-required-plugin', 'some-required-plugin-2'],
            optionalPlugins: ['some-optional-plugin'],
            ui: true,
        })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).resolves.toEqual({
        id: 'someId',
        configPath: ['some', 'path'],
        version: 'some-version',
        kibanaVersion: '7.0.0',
        optionalPlugins: ['some-optional-plugin'],
        requiredPlugins: ['some-required-plugin', 'some-required-plugin-2'],
        server: false,
        ui: true,
    });
});
test('return manifest when plugin expected Kibana version matches actual version', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({
            id: 'someId',
            configPath: 'some-path',
            version: 'some-version',
            kibanaVersion: '7.0.0-alpha2',
            requiredPlugins: ['some-required-plugin'],
            server: true,
        })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).resolves.toEqual({
        id: 'someId',
        configPath: 'some-path',
        version: 'some-version',
        kibanaVersion: '7.0.0-alpha2',
        optionalPlugins: [],
        requiredPlugins: ['some-required-plugin'],
        server: true,
        ui: false,
    });
});
test('return manifest when plugin expected Kibana version is `kibana`', async () => {
    plugin_manifest_parser_test_mocks_1.mockReadFile.mockImplementation((path, cb) => {
        cb(null, Buffer.from(JSON.stringify({
            id: 'someId',
            version: 'some-version',
            kibanaVersion: 'kibana',
            requiredPlugins: ['some-required-plugin'],
            server: true,
            ui: true,
        })));
    });
    await expect(plugin_manifest_parser_1.parseManifest(pluginPath, packageInfo, logger)).resolves.toEqual({
        id: 'someId',
        configPath: 'some_id',
        version: 'some-version',
        kibanaVersion: 'kibana',
        optionalPlugins: [],
        requiredPlugins: ['some-required-plugin'],
        server: true,
        ui: true,
    });
});
