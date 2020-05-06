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
const kbn_server_1 = require("../../../../../test_utils/kbn_server");
const http_server_mocks_1 = require("../../../http/http_server.mocks");
let servers;
let esServer;
let kbn;
let kbnServer;
let services;
async function startServers() {
    servers = kbn_server_1.createTestServers({
        adjustTimeout: t => jest.setTimeout(t),
        settings: {
            kbn: {
                uiSettings: {
                    overrides: {
                        foo: 'bar',
                    },
                },
            },
        },
    });
    esServer = await servers.startES();
    kbn = await servers.startKibana();
    kbnServer = kbn.kbnServer;
}
exports.startServers = startServers;
async function deleteKibanaIndex(callCluster) {
    const kibanaIndices = await callCluster('cat.indices', { index: '.kibana*', format: 'json' });
    const indexNames = kibanaIndices.map((x) => x.index);
    if (!indexNames.length) {
        return;
    }
    await callCluster('indices.putSettings', {
        index: indexNames,
        body: { index: { blocks: { read_only: false } } },
    });
    await callCluster('indices.delete', { index: indexNames });
    return indexNames;
}
function getServices() {
    if (services) {
        return services;
    }
    const callCluster = esServer.es.getCallCluster();
    const savedObjects = kbnServer.server.savedObjects;
    const savedObjectsClient = savedObjects.getScopedSavedObjectsClient(http_server_mocks_1.httpServerMock.createKibanaRequest());
    const uiSettings = kbnServer.server.uiSettingsServiceFactory({
        savedObjectsClient,
    });
    services = {
        kbnServer,
        callCluster,
        savedObjectsClient,
        uiSettings,
        deleteKibanaIndex,
    };
    return services;
}
exports.getServices = getServices;
async function stopServers() {
    services = null;
    kbnServer = null;
    if (servers) {
        await esServer.stop();
        await kbn.stop();
    }
}
exports.stopServers = stopServers;
