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
const hapi_1 = require("hapi");
const capabilities_mixin_1 = require("./capabilities_mixin");
describe('capabilitiesMixin', () => {
    let registerMock;
    const getKbnServer = (pluginSpecs = []) => {
        return {
            afterPluginsInit: (callback) => callback(),
            pluginSpecs,
            newPlatform: {
                setup: {
                    core: {
                        capabilities: {
                            registerProvider: registerMock,
                        },
                    },
                },
            },
        };
    };
    let server;
    beforeEach(() => {
        server = new hapi_1.Server();
        server.getUiNavLinks = () => [];
        registerMock = jest.fn();
    });
    it('calls capabilities#registerCapabilitiesProvider for each legacy plugin specs', async () => {
        const getPluginSpec = (provider) => ({
            getUiCapabilitiesProvider: () => provider,
        });
        const capaA = { catalogue: { A: true } };
        const capaB = { catalogue: { B: true } };
        const kbnServer = getKbnServer([getPluginSpec(() => capaA), getPluginSpec(() => capaB)]);
        await capabilities_mixin_1.capabilitiesMixin(kbnServer, server);
        expect(registerMock).toHaveBeenCalledTimes(2);
        expect(registerMock.mock.calls[0][0]()).toEqual(capaA);
        expect(registerMock.mock.calls[1][0]()).toEqual(capaB);
    });
});
