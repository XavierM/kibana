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
/* eslint-disable max-classes-per-file */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const config_service_test_mocks_1 = require("./config_service.test.mocks");
const raw_config_service_mock_1 = require("./raw_config_service.mock");
const config_schema_1 = require("@kbn/config-schema");
const _1 = require(".");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const env_1 = require("./__mocks__/env");
const emptyArgv = env_1.getEnvOptions();
const defaultEnv = new _1.Env('/kibana', emptyArgv);
const logger = logging_service_mock_1.loggingServiceMock.create();
const getRawConfigProvider = (rawConfig) => raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig });
test('returns config at path as observable', async () => {
    const rawConfig = getRawConfigProvider({ key: 'foo' });
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    const stringSchema = config_schema_1.schema.string();
    await configService.setSchema('key', stringSchema);
    const value$ = configService.atPath('key');
    expect(value$).toBeInstanceOf(rxjs_1.Observable);
    const value = await value$.pipe(operators_1.first()).toPromise();
    expect(value).toBe('foo');
});
test('throws if config at path does not match schema', async () => {
    const rawConfig = getRawConfigProvider({ key: 123 });
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    await configService.setSchema('key', config_schema_1.schema.string());
    const valuesReceived = [];
    await configService
        .atPath('key')
        .pipe(operators_1.take(1))
        .subscribe(value => {
        valuesReceived.push(value);
    }, error => {
        valuesReceived.push(error);
    });
    await expect(valuesReceived).toMatchInlineSnapshot(`
      Array [
        [Error: [config validation of [key]]: expected value of type [string] but got [number]],
      ]
  `);
});
test('re-validate config when updated', async () => {
    const rawConfig$ = new rxjs_1.BehaviorSubject({ key: 'value' });
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig$ });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    configService.setSchema('key', config_schema_1.schema.string());
    const valuesReceived = [];
    await configService.atPath('key').subscribe(value => {
        valuesReceived.push(value);
    }, error => {
        valuesReceived.push(error);
    });
    rawConfig$.next({ key: 123 });
    await expect(valuesReceived).toMatchInlineSnapshot(`
        Array [
          "value",
          [Error: [config validation of [key]]: expected value of type [string] but got [number]],
        ]
  `);
});
test("returns undefined if fetching optional config at a path that doesn't exist", async () => {
    const rawConfig = getRawConfigProvider({});
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    const value$ = configService.optionalAtPath('unique-name');
    const value = await value$.pipe(operators_1.first()).toPromise();
    expect(value).toBeUndefined();
});
test('returns observable config at optional path if it exists', async () => {
    const rawConfig = getRawConfigProvider({ value: 'bar' });
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    await configService.setSchema('value', config_schema_1.schema.string());
    const value$ = configService.optionalAtPath('value');
    const value = await value$.pipe(operators_1.first()).toPromise();
    expect(value).toBe('bar');
});
test("does not push new configs when reloading if config at path hasn't changed", async () => {
    const rawConfig$ = new rxjs_1.BehaviorSubject({ key: 'value' });
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig$ });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    await configService.setSchema('key', config_schema_1.schema.string());
    const valuesReceived = [];
    configService.atPath('key').subscribe(value => {
        valuesReceived.push(value);
    });
    rawConfig$.next({ key: 'value' });
    expect(valuesReceived).toEqual(['value']);
});
test('pushes new config when reloading and config at path has changed', async () => {
    const rawConfig$ = new rxjs_1.BehaviorSubject({ key: 'value' });
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig$ });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    await configService.setSchema('key', config_schema_1.schema.string());
    const valuesReceived = [];
    configService.atPath('key').subscribe(value => {
        valuesReceived.push(value);
    });
    rawConfig$.next({ key: 'new value' });
    expect(valuesReceived).toEqual(['value', 'new value']);
});
test("throws error if 'schema' is not defined for a key", async () => {
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { key: 'value' } });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const configs = configService.atPath('key');
    await expect(configs.pipe(operators_1.first()).toPromise()).rejects.toMatchInlineSnapshot(`[Error: No validation schema has been defined for [key]]`);
});
test("throws error if 'setSchema' called several times for the same key", async () => {
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { key: 'value' } });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const addSchema = async () => await configService.setSchema('key', config_schema_1.schema.string());
    await addSchema();
    await expect(addSchema()).rejects.toMatchInlineSnapshot(`[Error: Validation schema for [key] was already registered.]`);
});
test('flags schema paths as handled when registering a schema', async () => {
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({
        rawConfig: {
            service: {
                string: 'str',
                number: 42,
            },
        },
    });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    await configService.setSchema('service', config_schema_1.schema.object({
        string: config_schema_1.schema.string(),
        number: config_schema_1.schema.number(),
    }));
    expect(await configService.getUsedPaths()).toMatchInlineSnapshot(`
    Array [
      "service.string",
      "service.number",
    ]
  `);
});
test('tracks unhandled paths', async () => {
    const initialConfig = {
        bar: {
            deep1: {
                key: '123',
            },
            deep2: {
                key: '321',
            },
        },
        foo: 'value',
        quux: {
            deep1: {
                key: 'hello',
            },
            deep2: {
                key: 'world',
            },
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    configService.atPath('foo');
    configService.atPath(['bar', 'deep2']);
    const unused = await configService.getUnusedPaths();
    expect(unused).toEqual(['bar.deep1.key', 'quux.deep1.key', 'quux.deep2.key']);
});
test('correctly passes context', async () => {
    config_service_test_mocks_1.mockPackage.raw = {
        branch: 'feature-v1',
        version: 'v1',
        build: {
            distributable: true,
            number: 100,
            sha: 'feature-v1-build-sha',
        },
    };
    const env = new _1.Env('/kibana', env_1.getEnvOptions());
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: { foo: {} } });
    const schemaDefinition = config_schema_1.schema.object({
        branchRef: config_schema_1.schema.string({
            defaultValue: config_schema_1.schema.contextRef('branch'),
        }),
        buildNumRef: config_schema_1.schema.number({
            defaultValue: config_schema_1.schema.contextRef('buildNum'),
        }),
        buildShaRef: config_schema_1.schema.string({
            defaultValue: config_schema_1.schema.contextRef('buildSha'),
        }),
        devRef: config_schema_1.schema.boolean({ defaultValue: config_schema_1.schema.contextRef('dev') }),
        prodRef: config_schema_1.schema.boolean({ defaultValue: config_schema_1.schema.contextRef('prod') }),
        versionRef: config_schema_1.schema.string({
            defaultValue: config_schema_1.schema.contextRef('version'),
        }),
    });
    const configService = new _1.ConfigService(rawConfigProvider, env, logger);
    await configService.setSchema('foo', schemaDefinition);
    const value$ = configService.atPath('foo');
    expect(await value$.pipe(operators_1.first()).toPromise()).toMatchSnapshot();
});
test('handles enabled path, but only marks the enabled path as used', async () => {
    const initialConfig = {
        pid: {
            enabled: true,
            file: '/some/file.pid',
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const isEnabled = await configService.isEnabledAtPath('pid');
    expect(isEnabled).toBe(true);
    const unusedPaths = await configService.getUnusedPaths();
    expect(unusedPaths).toEqual(['pid.file']);
});
test('handles enabled path when path is array', async () => {
    const initialConfig = {
        pid: {
            enabled: true,
            file: '/some/file.pid',
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const isEnabled = await configService.isEnabledAtPath(['pid']);
    expect(isEnabled).toBe(true);
    const unusedPaths = await configService.getUnusedPaths();
    expect(unusedPaths).toEqual(['pid.file']);
});
test('handles disabled path and marks config as used', async () => {
    const initialConfig = {
        pid: {
            enabled: false,
            file: '/some/file.pid',
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const isEnabled = await configService.isEnabledAtPath('pid');
    expect(isEnabled).toBe(false);
    const unusedPaths = await configService.getUnusedPaths();
    expect(unusedPaths).toEqual([]);
});
test('does not throw if schema does not define "enabled" schema', async () => {
    const initialConfig = {
        pid: {
            file: '/some/file.pid',
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    await expect(configService.setSchema('pid', config_schema_1.schema.object({
        file: config_schema_1.schema.string(),
    }))).resolves.toBeUndefined();
    const value$ = configService.atPath('pid');
    const value = await value$.pipe(operators_1.first()).toPromise();
    expect(value.enabled).toBe(undefined);
    const valueOptional$ = configService.optionalAtPath('pid');
    const valueOptional = await valueOptional$.pipe(operators_1.first()).toPromise();
    expect(valueOptional.enabled).toBe(undefined);
});
test('treats config as enabled if config path is not present in config', async () => {
    const initialConfig = {};
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const isEnabled = await configService.isEnabledAtPath('pid');
    expect(isEnabled).toBe(true);
    const unusedPaths = await configService.getUnusedPaths();
    expect(unusedPaths).toEqual([]);
});
test('read "enabled" even if its schema is not present', async () => {
    const initialConfig = {
        foo: {
            enabled: true,
        },
    };
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    const isEnabled = await configService.isEnabledAtPath('foo');
    expect(isEnabled).toBe(true);
});
test('allows plugins to specify "enabled" flag via validation schema', async () => {
    const initialConfig = {};
    const rawConfigProvider = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: initialConfig });
    const configService = new _1.ConfigService(rawConfigProvider, defaultEnv, logger);
    await configService.setSchema('foo', config_schema_1.schema.object({ enabled: config_schema_1.schema.boolean({ defaultValue: false }) }));
    expect(await configService.isEnabledAtPath('foo')).toBe(false);
    await configService.setSchema('bar', config_schema_1.schema.object({ enabled: config_schema_1.schema.boolean({ defaultValue: true }) }));
    expect(await configService.isEnabledAtPath('bar')).toBe(true);
    await configService.setSchema('baz', config_schema_1.schema.object({ different: config_schema_1.schema.boolean({ defaultValue: true }) }));
    expect(await configService.isEnabledAtPath('baz')).toBe(true);
});
test('does not throw during validation is every schema is valid', async () => {
    const rawConfig = getRawConfigProvider({ stringKey: 'foo', numberKey: 42 });
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    await configService.setSchema('stringKey', config_schema_1.schema.string());
    await configService.setSchema('numberKey', config_schema_1.schema.number());
    await expect(configService.validate()).resolves.toBeUndefined();
});
test('throws during validation is any schema is invalid', async () => {
    const rawConfig = getRawConfigProvider({ stringKey: 123, numberKey: 42 });
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    await configService.setSchema('stringKey', config_schema_1.schema.string());
    await configService.setSchema('numberKey', config_schema_1.schema.number());
    await expect(configService.validate()).rejects.toThrowErrorMatchingInlineSnapshot(`"[config validation of [stringKey]]: expected value of type [string] but got [number]"`);
});
test('logs deprecation warning during validation', async () => {
    const rawConfig = getRawConfigProvider({});
    const configService = new _1.ConfigService(rawConfig, defaultEnv, logger);
    config_service_test_mocks_1.mockApplyDeprecations.mockImplementationOnce((config, deprecations, log) => {
        log('some deprecation message');
        log('another deprecation message');
        return config;
    });
    logging_service_mock_1.loggingServiceMock.clear(logger);
    await configService.validate();
    expect(logging_service_mock_1.loggingServiceMock.collect(logger).warn).toMatchInlineSnapshot(`
    Array [
      Array [
        "some deprecation message",
      ],
      Array [
        "another deprecation message",
      ],
    ]
  `);
});
