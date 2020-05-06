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
const moment_1 = require("moment");
const operators_1 = require("rxjs/operators");
const plugin_context_1 = require("./plugin_context");
const config_1 = require("../config");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const raw_config_service_mock_1 = require("../config/raw_config_service.mock");
const env_1 = require("../config/__mocks__/env");
const server_1 = require("../server");
const utils_1 = require("../utils");
const logger = logging_service_mock_1.loggingServiceMock.create();
let coreId;
let env;
let coreContext;
let server;
function createPluginManifest(manifestProps = {}) {
    return {
        id: 'some-plugin-id',
        version: 'some-version',
        configPath: 'path',
        kibanaVersion: '7.0.0',
        requiredPlugins: ['some-required-dep'],
        optionalPlugins: ['some-optional-dep'],
        server: true,
        ui: true,
        ...manifestProps,
    };
}
describe('Plugin Context', () => {
    beforeEach(async () => {
        coreId = Symbol('core');
        env = config_1.Env.createDefault(env_1.getEnvOptions());
        const config$ = raw_config_service_mock_1.rawConfigServiceMock.create({ rawConfig: {} });
        server = new server_1.Server(config$, env, logger);
        await server.setupCoreConfig();
        coreContext = { coreId, env, logger, configService: server.configService };
    });
    it('should return a globalConfig handler in the context', async () => {
        const manifest = createPluginManifest();
        const opaqueId = Symbol();
        const pluginInitializerContext = plugin_context_1.createPluginInitializerContext(coreContext, opaqueId, manifest);
        expect(pluginInitializerContext.config.legacy.globalConfig$).toBeDefined();
        const configObject = await pluginInitializerContext.config.legacy.globalConfig$
            .pipe(operators_1.first())
            .toPromise();
        expect(configObject).toStrictEqual({
            kibana: {
                index: '.kibana',
                autocompleteTerminateAfter: moment_1.duration(100000),
                autocompleteTimeout: moment_1.duration(1000),
            },
            elasticsearch: {
                shardTimeout: moment_1.duration(30, 's'),
                requestTimeout: moment_1.duration(30, 's'),
                pingTimeout: moment_1.duration(30, 's'),
                startupTimeout: moment_1.duration(5, 's'),
            },
            path: { data: utils_1.fromRoot('data') },
        });
    });
});
