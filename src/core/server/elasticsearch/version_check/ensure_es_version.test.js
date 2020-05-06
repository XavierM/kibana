"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const ensure_es_version_1 = require("./ensure_es_version");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const operators_1 = require("rxjs/operators");
const testing_1 = require("rxjs/testing");
const rxjs_1 = require("rxjs");
const mockLoggerFactory = logging_service_mock_1.loggingServiceMock.create();
const mockLogger = mockLoggerFactory.get('mock logger');
const KIBANA_VERSION = '5.1.0';
function createNodes(...versions) {
    const nodes = {};
    versions
        .map(version => {
        return {
            version,
            http: {
                publish_address: 'http_address',
            },
            ip: 'ip',
        };
    })
        .forEach((node, i) => {
        nodes[`node-${i}`] = node;
    });
    return { nodes };
}
describe('mapNodesVersionCompatibility', () => {
    function createNodesInfoWithoutHTTP(version) {
        return { nodes: { 'node-without-http': { version, ip: 'ip' } } };
    }
    it('returns isCompatible=true with a single node that matches', async () => {
        const nodesInfo = createNodes('5.1.0');
        const result = await ensure_es_version_1.mapNodesVersionCompatibility(nodesInfo, KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(true);
    });
    it('returns isCompatible=true with multiple nodes that satisfy', async () => {
        const nodesInfo = createNodes('5.1.0', '5.2.0', '5.1.1-Beta1');
        const result = await ensure_es_version_1.mapNodesVersionCompatibility(nodesInfo, KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(true);
    });
    it('returns isCompatible=false for a single node that is out of date', () => {
        // 5.0.0 ES is too old to work with a 5.1.0 version of Kibana.
        const nodesInfo = createNodes('5.1.0', '5.2.0', '5.0.0');
        const result = ensure_es_version_1.mapNodesVersionCompatibility(nodesInfo, KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(false);
        expect(result.message).toMatchInlineSnapshot(`"This version of Kibana (v5.1.0) is incompatible with the following Elasticsearch nodes in your cluster: v5.0.0 @ http_address (ip)"`);
    });
    it('returns isCompatible=false for an incompatible node without http publish address', async () => {
        const nodesInfo = createNodesInfoWithoutHTTP('6.1.1');
        const result = ensure_es_version_1.mapNodesVersionCompatibility(nodesInfo, KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(false);
        expect(result.message).toMatchInlineSnapshot(`"This version of Kibana (v5.1.0) is incompatible with the following Elasticsearch nodes in your cluster: v6.1.1 @ undefined (ip)"`);
    });
    it('returns isCompatible=true for outdated nodes when ignoreVersionMismatch=true', async () => {
        // 5.0.0 ES is too old to work with a 5.1.0 version of Kibana.
        const nodesInfo = createNodes('5.1.0', '5.2.0', '5.0.0');
        const ignoreVersionMismatch = true;
        const result = ensure_es_version_1.mapNodesVersionCompatibility(nodesInfo, KIBANA_VERSION, ignoreVersionMismatch);
        expect(result.isCompatible).toBe(true);
        expect(result.message).toMatchInlineSnapshot(`"Ignoring version incompatibility between Kibana v5.1.0 and the following Elasticsearch nodes: v5.0.0 @ http_address (ip)"`);
    });
    it('returns isCompatible=true with a message if a node is only off by a patch version', () => {
        const result = ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.1'), KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(true);
        expect(result.message).toMatchInlineSnapshot(`"You're running Kibana 5.1.0 with some different versions of Elasticsearch. Update Kibana or Elasticsearch to the same version to prevent compatibility issues: v5.1.1 @ http_address (ip)"`);
    });
    it('returns isCompatible=true with a message if a node is only off by a patch version and without http publish address', async () => {
        const result = ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.1'), KIBANA_VERSION, false);
        expect(result.isCompatible).toBe(true);
        expect(result.message).toMatchInlineSnapshot(`"You're running Kibana 5.1.0 with some different versions of Elasticsearch. Update Kibana or Elasticsearch to the same version to prevent compatibility issues: v5.1.1 @ http_address (ip)"`);
    });
});
describe('pollEsNodesVersion', () => {
    const callWithInternalUser = jest.fn();
    const getTestScheduler = () => new testing_1.TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });
    beforeEach(() => {
        callWithInternalUser.mockClear();
    });
    it('returns iscCompatible=false and keeps polling when a poll request throws', done => {
        expect.assertions(3);
        const expectedCompatibilityResults = [false, false, true];
        jest.clearAllMocks();
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.0', '5.2.0', '5.0.0'));
        callWithInternalUser.mockRejectedValueOnce(new Error('mock request error'));
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.0', '5.2.0', '5.1.1-Beta1'));
        ensure_es_version_1.pollEsNodesVersion({
            callWithInternalUser,
            esVersionCheckInterval: 1,
            ignoreVersionMismatch: false,
            kibanaVersion: KIBANA_VERSION,
            log: mockLogger,
        })
            .pipe(operators_1.take(3))
            .subscribe({
            next: result => {
                expect(result.isCompatible).toBe(expectedCompatibilityResults.shift());
            },
            complete: done,
            error: done,
        });
    });
    it('returns compatibility results', done => {
        expect.assertions(1);
        const nodes = createNodes('5.1.0', '5.2.0', '5.0.0');
        callWithInternalUser.mockResolvedValueOnce(nodes);
        ensure_es_version_1.pollEsNodesVersion({
            callWithInternalUser,
            esVersionCheckInterval: 1,
            ignoreVersionMismatch: false,
            kibanaVersion: KIBANA_VERSION,
            log: mockLogger,
        })
            .pipe(operators_1.take(1))
            .subscribe({
            next: result => {
                expect(result).toEqual(ensure_es_version_1.mapNodesVersionCompatibility(nodes, KIBANA_VERSION, false));
            },
            complete: done,
            error: done,
        });
    });
    it('only emits if the node versions changed since the previous poll', done => {
        expect.assertions(4);
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.0', '5.2.0', '5.0.0')); // emit
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.0.0', '5.1.0', '5.2.0')); // ignore, same versions, different ordering
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.1', '5.2.0', '5.0.0')); // emit
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.1', '5.1.2', '5.1.3')); // emit
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.1.1', '5.1.2', '5.1.3')); // ignore
        callWithInternalUser.mockResolvedValueOnce(createNodes('5.0.0', '5.1.0', '5.2.0')); // emit, different from previous version
        ensure_es_version_1.pollEsNodesVersion({
            callWithInternalUser,
            esVersionCheckInterval: 1,
            ignoreVersionMismatch: false,
            kibanaVersion: KIBANA_VERSION,
            log: mockLogger,
        })
            .pipe(operators_1.take(4))
            .subscribe({
            next: result => expect(result).toBeDefined(),
            complete: done,
            error: done,
        });
    });
    it('starts polling immediately and then every esVersionCheckInterval', () => {
        expect.assertions(1);
        callWithInternalUser.mockReturnValueOnce([createNodes('5.1.0', '5.2.0', '5.0.0')]);
        callWithInternalUser.mockReturnValueOnce([createNodes('5.1.1', '5.2.0', '5.0.0')]);
        getTestScheduler().run(({ expectObservable }) => {
            const expected = 'a 99ms (b|)';
            const esNodesCompatibility$ = ensure_es_version_1.pollEsNodesVersion({
                callWithInternalUser,
                esVersionCheckInterval: 100,
                ignoreVersionMismatch: false,
                kibanaVersion: KIBANA_VERSION,
                log: mockLogger,
            }).pipe(operators_1.take(2));
            expectObservable(esNodesCompatibility$).toBe(expected, {
                a: ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.0', '5.2.0', '5.0.0'), KIBANA_VERSION, false),
                b: ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.1', '5.2.0', '5.0.0'), KIBANA_VERSION, false),
            });
        });
    });
    it('waits for es version check requests to complete before scheduling the next one', () => {
        expect.assertions(2);
        getTestScheduler().run(({ expectObservable }) => {
            const expected = '100ms a 99ms (b|)';
            callWithInternalUser.mockReturnValueOnce(rxjs_1.of(createNodes('5.1.0', '5.2.0', '5.0.0')).pipe(operators_1.delay(100)));
            callWithInternalUser.mockReturnValueOnce(rxjs_1.of(createNodes('5.1.1', '5.2.0', '5.0.0')).pipe(operators_1.delay(100)));
            const esNodesCompatibility$ = ensure_es_version_1.pollEsNodesVersion({
                callWithInternalUser,
                esVersionCheckInterval: 10,
                ignoreVersionMismatch: false,
                kibanaVersion: KIBANA_VERSION,
                log: mockLogger,
            }).pipe(operators_1.take(2));
            expectObservable(esNodesCompatibility$).toBe(expected, {
                a: ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.0', '5.2.0', '5.0.0'), KIBANA_VERSION, false),
                b: ensure_es_version_1.mapNodesVersionCompatibility(createNodes('5.1.1', '5.2.0', '5.0.0'), KIBANA_VERSION, false),
            });
        });
        expect(callWithInternalUser).toHaveBeenCalledTimes(2);
    });
});
