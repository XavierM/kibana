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
const env_test_mocks_1 = require("./env.test.mocks");
const _1 = require(".");
const env_1 = require("./__mocks__/env");
test('correctly creates default environment in dev mode.', () => {
    env_test_mocks_1.mockPackage.raw = {
        branch: 'some-branch',
        version: 'some-version',
    };
    const defaultEnv = _1.Env.createDefault(env_1.getEnvOptions({
        configs: ['/test/cwd/config/kibana.yml'],
        isDevClusterMaster: true,
    }));
    expect(defaultEnv).toMatchSnapshot('env properties');
});
test('correctly creates default environment in prod distributable mode.', () => {
    env_test_mocks_1.mockPackage.raw = {
        branch: 'feature-v1',
        version: 'v1',
        build: {
            distributable: true,
            number: 100,
            sha: 'feature-v1-build-sha',
        },
    };
    const defaultEnv = _1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { dev: false },
        configs: ['/some/other/path/some-kibana.yml'],
    }));
    expect(defaultEnv).toMatchSnapshot('env properties');
});
test('correctly creates default environment in prod non-distributable mode.', () => {
    env_test_mocks_1.mockPackage.raw = {
        branch: 'feature-v1',
        version: 'v1',
        build: {
            distributable: false,
            number: 100,
            sha: 'feature-v1-build-sha',
        },
    };
    const defaultEnv = _1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { dev: false },
        configs: ['/some/other/path/some-kibana.yml'],
    }));
    expect(defaultEnv).toMatchSnapshot('env properties');
});
test('correctly creates default environment if `--env.name` is supplied.', () => {
    env_test_mocks_1.mockPackage.raw = {
        branch: 'feature-v1',
        version: 'v1',
        build: {
            distributable: false,
            number: 100,
            sha: 'feature-v1-build-sha',
        },
    };
    const defaultDevEnv = _1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { envName: 'development' },
        configs: ['/some/other/path/some-kibana.yml'],
    }));
    const defaultProdEnv = _1.Env.createDefault(env_1.getEnvOptions({
        cliArgs: { dev: false, envName: 'production' },
        configs: ['/some/other/path/some-kibana.yml'],
    }));
    expect(defaultDevEnv).toMatchSnapshot('dev env properties');
    expect(defaultProdEnv).toMatchSnapshot('prod env properties');
});
test('correctly creates environment with constructor.', () => {
    env_test_mocks_1.mockPackage.raw = {
        branch: 'feature-v1',
        version: 'v1',
        build: {
            distributable: true,
            number: 100,
            sha: 'feature-v1-build-sha',
        },
    };
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { dev: false },
        configs: ['/some/other/path/some-kibana.yml'],
    }));
    expect(env).toMatchSnapshot('env properties');
});
test('pluginSearchPaths contains x-pack plugins path if --oss flag is false', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { oss: false },
    }));
    expect(env.pluginSearchPaths).toContain('/some/home/dir/x-pack/plugins');
});
test('pluginSearchPaths does not contains x-pack plugins path if --oss flag is true', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { oss: true },
    }));
    expect(env.pluginSearchPaths).not.toContain('/some/home/dir/x-pack/plugins');
});
test('pluginSearchPaths contains examples plugins path if --run-examples flag is true', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { runExamples: true },
    }));
    expect(env.pluginSearchPaths).toContain('/some/home/dir/examples');
});
test('pluginSearchPaths contains x-pack/examples plugins path if --run-examples flag is true', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { runExamples: true },
    }));
    expect(env.pluginSearchPaths).toContain('/some/home/dir/x-pack/examples');
});
test('pluginSearchPaths does not contains examples plugins path if --run-examples flag is false', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { runExamples: false },
    }));
    expect(env.pluginSearchPaths).not.toContain('/some/home/dir/examples');
});
test('pluginSearchPaths does not contains x-pack/examples plugins path if --run-examples flag is false', () => {
    const env = new _1.Env('/some/home/dir', env_1.getEnvOptions({
        cliArgs: { runExamples: false },
    }));
    expect(env.pluginSearchPaths).not.toContain('/some/home/dir/x-pack/examples');
});
