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
const raw_config_service_test_mocks_1 = require("./raw_config_service.test.mocks");
const operators_1 = require("rxjs/operators");
const _1 = require(".");
const configFile = '/config/kibana.yml';
const anotherConfigFile = '/config/kibana.dev.yml';
beforeEach(() => {
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockReset();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({}));
});
test('loads single raw config when started', () => {
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenCalledTimes(1);
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenLastCalledWith([configFile]);
});
test('loads multiple raw configs when started', () => {
    const configService = new _1.RawConfigService([configFile, anotherConfigFile]);
    configService.loadConfig();
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenCalledTimes(1);
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenLastCalledWith([configFile, anotherConfigFile]);
});
test('re-reads single config when reloading', () => {
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockClear();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ foo: 'bar' }));
    configService.reloadConfig();
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenCalledTimes(1);
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenLastCalledWith([configFile]);
});
test('re-reads multiple configs when reloading', () => {
    const configService = new _1.RawConfigService([configFile, anotherConfigFile]);
    configService.loadConfig();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockClear();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ foo: 'bar' }));
    configService.reloadConfig();
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenCalledTimes(1);
    expect(raw_config_service_test_mocks_1.mockGetConfigFromFiles).toHaveBeenLastCalledWith([configFile, anotherConfigFile]);
});
test('returns config at path as observable', async () => {
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'value' }));
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    const exampleConfig = await configService
        .getConfig$()
        .pipe(operators_1.first())
        .toPromise();
    expect(exampleConfig.key).toEqual('value');
    expect(Object.keys(exampleConfig)).toEqual(['key']);
});
test("pushes new configs when reloading even if config at path hasn't changed", async () => {
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'value' }));
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    const valuesReceived = [];
    configService.getConfig$().subscribe(config => {
        valuesReceived.push(config);
    });
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockClear();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'value' }));
    configService.reloadConfig();
    expect(valuesReceived).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "value",
      },
      Object {
        "key": "value",
      },
    ]
  `);
});
test('pushes new config when reloading and config at path has changed', async () => {
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'value' }));
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    const valuesReceived = [];
    configService.getConfig$().subscribe(config => {
        valuesReceived.push(config);
    });
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockClear();
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'new value' }));
    configService.reloadConfig();
    expect(valuesReceived).toHaveLength(2);
    expect(valuesReceived[0].key).toEqual('value');
    expect(Object.keys(valuesReceived[0])).toEqual(['key']);
    expect(valuesReceived[1].key).toEqual('new value');
    expect(Object.keys(valuesReceived[1])).toEqual(['key']);
});
test('completes config observables when stopped', done => {
    expect.assertions(0);
    raw_config_service_test_mocks_1.mockGetConfigFromFiles.mockImplementation(() => ({ key: 'value' }));
    const configService = new _1.RawConfigService([configFile]);
    configService.loadConfig();
    configService.getConfig$().subscribe({
        complete: () => done(),
    });
    configService.stop();
});
