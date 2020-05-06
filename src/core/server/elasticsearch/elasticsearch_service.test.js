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
const operators_1 = require("rxjs/operators");
const elasticsearch_service_test_mocks_1 = require("./elasticsearch_service.test.mocks");
const rxjs_1 = require("rxjs");
const config_1 = require("../config");
const env_1 = require("../config/__mocks__/env");
const config_service_mock_1 = require("../config/config_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const elasticsearch_config_1 = require("./elasticsearch_config");
const elasticsearch_service_1 = require("./elasticsearch_service");
const elasticsearch_service_mock_1 = require("./elasticsearch_service.mock");
const moment_1 = require("moment");
const delay = async (durationMs) => await new Promise(resolve => setTimeout(resolve, durationMs));
let elasticsearchService;
const configService = config_service_mock_1.configServiceMock.create();
const deps = {
    http: http_service_mock_1.httpServiceMock.createSetupContract(),
};
configService.atPath.mockReturnValue(new rxjs_1.BehaviorSubject({
    hosts: ['http://1.2.3.4'],
    healthCheck: {
        delay: moment_1.duration(10),
    },
    ssl: {
        verificationMode: 'none',
    },
}));
let env;
let coreContext;
const logger = logging_service_mock_1.loggingServiceMock.create();
beforeEach(() => {
    env = config_1.Env.createDefault(env_1.getEnvOptions());
    coreContext = { coreId: Symbol(), env, logger, configService: configService };
    elasticsearchService = new elasticsearch_service_1.ElasticsearchService(coreContext);
});
afterEach(() => jest.clearAllMocks());
describe('#setup', () => {
    it('returns legacy Elasticsearch config as a part of the contract', async () => {
        const setupContract = await elasticsearchService.setup(deps);
        await expect(setupContract.legacy.config$.pipe(operators_1.first()).toPromise()).resolves.toBeInstanceOf(elasticsearch_config_1.ElasticsearchConfig);
    });
    it('returns data and admin client as a part of the contract', async () => {
        const mockAdminClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        const mockDataClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementationOnce(() => mockAdminClusterClientInstance).mockImplementationOnce(() => mockDataClusterClientInstance);
        const setupContract = await elasticsearchService.setup(deps);
        const adminClient = setupContract.adminClient;
        const dataClient = setupContract.dataClient;
        expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(0);
        await adminClient.callAsInternalUser('any');
        expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
        expect(mockDataClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(0);
        await dataClient.callAsInternalUser('any');
        expect(mockDataClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
    });
    describe('#createClient', () => {
        it('allows to specify config properties', async () => {
            const setupContract = await elasticsearchService.setup(deps);
            const mockClusterClientInstance = { close: jest.fn() };
            elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementation(() => mockClusterClientInstance);
            const customConfig = { logQueries: true };
            const clusterClient = setupContract.createClient('some-custom-type', customConfig);
            expect(clusterClient).toBe(mockClusterClientInstance);
            expect(elasticsearch_service_test_mocks_1.MockClusterClient).toHaveBeenCalledWith(expect.objectContaining(customConfig), expect.objectContaining({ context: ['elasticsearch', 'some-custom-type'] }), expect.any(Function));
        });
        it('falls back to elasticsearch default config values if property not specified', async () => {
            const setupContract = await elasticsearchService.setup(deps);
            // reset all mocks called during setup phase
            elasticsearch_service_test_mocks_1.MockClusterClient.mockClear();
            const customConfig = {
                hosts: ['http://8.8.8.8'],
                logQueries: true,
                ssl: { certificate: 'certificate-value' },
            };
            setupContract.createClient('some-custom-type', customConfig);
            const config = elasticsearch_service_test_mocks_1.MockClusterClient.mock.calls[0][0];
            expect(config).toMatchInlineSnapshot(`
        Object {
          "healthCheckDelay": "PT0.01S",
          "hosts": Array [
            "http://8.8.8.8",
          ],
          "logQueries": true,
          "requestHeadersWhitelist": Array [
            undefined,
          ],
          "ssl": Object {
            "certificate": "certificate-value",
            "verificationMode": "none",
          },
        }
      `);
        });
        it('falls back to elasticsearch config if custom config not passed', async () => {
            const setupContract = await elasticsearchService.setup(deps);
            // reset all mocks called during setup phase
            elasticsearch_service_test_mocks_1.MockClusterClient.mockClear();
            setupContract.createClient('another-type');
            const config = elasticsearch_service_test_mocks_1.MockClusterClient.mock.calls[0][0];
            expect(config).toMatchInlineSnapshot(`
        Object {
          "healthCheckDelay": "PT0.01S",
          "hosts": Array [
            "http://1.2.3.4",
          ],
          "requestHeadersWhitelist": Array [
            undefined,
          ],
          "ssl": Object {
            "alwaysPresentCertificate": undefined,
            "certificate": undefined,
            "certificateAuthorities": undefined,
            "key": undefined,
            "keyPassphrase": undefined,
            "verificationMode": "none",
          },
        }
      `);
        });
        it('does not merge elasticsearch hosts if custom config overrides', async () => {
            configService.atPath.mockReturnValueOnce(new rxjs_1.BehaviorSubject({
                hosts: ['http://1.2.3.4', 'http://9.8.7.6'],
                healthCheck: {
                    delay: moment_1.duration(2000),
                },
                ssl: {
                    verificationMode: 'none',
                },
            }));
            elasticsearchService = new elasticsearch_service_1.ElasticsearchService(coreContext);
            const setupContract = await elasticsearchService.setup(deps);
            // reset all mocks called during setup phase
            elasticsearch_service_test_mocks_1.MockClusterClient.mockClear();
            const customConfig = {
                hosts: ['http://8.8.8.8'],
                logQueries: true,
                ssl: { certificate: 'certificate-value' },
            };
            setupContract.createClient('some-custom-type', customConfig);
            const config = elasticsearch_service_test_mocks_1.MockClusterClient.mock.calls[0][0];
            expect(config).toMatchInlineSnapshot(`
        Object {
          "healthCheckDelay": "PT2S",
          "hosts": Array [
            "http://8.8.8.8",
          ],
          "logQueries": true,
          "requestHeadersWhitelist": Array [
            undefined,
          ],
          "ssl": Object {
            "certificate": "certificate-value",
            "verificationMode": "none",
          },
        }
      `);
        });
    });
    it('esNodeVersionCompatibility$ only starts polling when subscribed to', async (done) => {
        const mockAdminClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        const mockDataClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementationOnce(() => mockAdminClusterClientInstance).mockImplementationOnce(() => mockDataClusterClientInstance);
        mockAdminClusterClientInstance.callAsInternalUser.mockRejectedValue(new Error());
        const setupContract = await elasticsearchService.setup(deps);
        await delay(10);
        expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(0);
        setupContract.esNodesCompatibility$.subscribe(() => {
            expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
            done();
        });
    });
    it('esNodeVersionCompatibility$ stops polling when unsubscribed from', async (done) => {
        const mockAdminClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        const mockDataClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createClusterClient();
        elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementationOnce(() => mockAdminClusterClientInstance).mockImplementationOnce(() => mockDataClusterClientInstance);
        mockAdminClusterClientInstance.callAsInternalUser.mockRejectedValue(new Error());
        const setupContract = await elasticsearchService.setup(deps);
        expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(0);
        const sub = setupContract.esNodesCompatibility$.subscribe(async () => {
            sub.unsubscribe();
            await delay(100);
            expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
describe('#stop', () => {
    it('stops both admin and data clients', async () => {
        const mockAdminClusterClientInstance = { close: jest.fn() };
        const mockDataClusterClientInstance = { close: jest.fn() };
        elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementationOnce(() => mockAdminClusterClientInstance).mockImplementationOnce(() => mockDataClusterClientInstance);
        await elasticsearchService.setup(deps);
        await elasticsearchService.stop();
        expect(mockAdminClusterClientInstance.close).toHaveBeenCalledTimes(1);
        expect(mockDataClusterClientInstance.close).toHaveBeenCalledTimes(1);
    });
    it('stops pollEsNodeVersions even if there are active subscriptions', async (done) => {
        expect.assertions(2);
        const mockAdminClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createCustomClusterClient();
        const mockDataClusterClientInstance = elasticsearch_service_mock_1.elasticsearchServiceMock.createCustomClusterClient();
        elasticsearch_service_test_mocks_1.MockClusterClient.mockImplementationOnce(() => mockAdminClusterClientInstance).mockImplementationOnce(() => mockDataClusterClientInstance);
        mockAdminClusterClientInstance.callAsInternalUser.mockRejectedValue(new Error());
        const setupContract = await elasticsearchService.setup(deps);
        setupContract.esNodesCompatibility$.subscribe(async () => {
            expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
            await elasticsearchService.stop();
            await delay(100);
            expect(mockAdminClusterClientInstance.callAsInternalUser).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
