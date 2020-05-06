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
const rxjs_1 = require("rxjs");
const status_1 = require("./status");
const status_2 = require("../status");
const test_utils_1 = require("../status/test_utils");
expect.addSnapshotSerializer(test_utils_1.ServiceStatusLevelSnapshotSerializer);
const nodeInfo = {
    version: '1.1.1',
    ip: '1.1.1.1',
    http: {
        publish_address: 'https://1.1.1.1:9200',
    },
    name: 'node1',
};
describe('calculateStatus', () => {
    it('starts in unavailable', async () => {
        expect(await status_1.calculateStatus$(new rxjs_1.Subject())
            .pipe(operators_1.take(1))
            .toPromise()).toEqual({
            level: status_2.ServiceStatusLevels.unavailable,
            summary: 'Waiting for Elasticsearch',
            meta: {
                warningNodes: [],
                incompatibleNodes: [],
            },
        });
    });
    it('changes to available when isCompatible and no warningNodes', async () => {
        expect(await status_1.calculateStatus$(rxjs_1.of({ isCompatible: true, kibanaVersion: '1.1.1', warningNodes: [], incompatibleNodes: [] }))
            .pipe(operators_1.take(2))
            .toPromise()).toEqual({
            level: status_2.ServiceStatusLevels.available,
            summary: 'Elasticsearch is available',
            meta: {
                warningNodes: [],
                incompatibleNodes: [],
            },
        });
    });
    it('changes to degraded when isCompatible and warningNodes present', async () => {
        expect(await status_1.calculateStatus$(rxjs_1.of({
            isCompatible: true,
            kibanaVersion: '1.1.1',
            warningNodes: [nodeInfo],
            incompatibleNodes: [],
            // this isn't the real message, just used to test that the message
            // is forwarded to the status
            message: 'Some nodes are a different version',
        }))
            .pipe(operators_1.take(2))
            .toPromise()).toEqual({
            level: status_2.ServiceStatusLevels.degraded,
            summary: 'Some nodes are a different version',
            meta: {
                incompatibleNodes: [],
                warningNodes: [nodeInfo],
            },
        });
    });
    it('changes to critical when isCompatible is false', async () => {
        expect(await status_1.calculateStatus$(rxjs_1.of({
            isCompatible: false,
            kibanaVersion: '2.1.1',
            warningNodes: [nodeInfo],
            incompatibleNodes: [nodeInfo],
            // this isn't the real message, just used to test that the message
            // is forwarded to the status
            message: 'Incompatible with Elasticsearch',
        }))
            .pipe(operators_1.take(2))
            .toPromise()).toEqual({
            level: status_2.ServiceStatusLevels.critical,
            summary: 'Incompatible with Elasticsearch',
            meta: {
                incompatibleNodes: [nodeInfo],
                warningNodes: [nodeInfo],
            },
        });
    });
    it('emits status updates when node compatibility changes', () => {
        const nodeCompat$ = new rxjs_1.Subject();
        const statusUpdates = [];
        const subscription = status_1.calculateStatus$(nodeCompat$).subscribe(status => statusUpdates.push(status));
        nodeCompat$.next({
            isCompatible: false,
            kibanaVersion: '2.1.1',
            incompatibleNodes: [],
            warningNodes: [],
            message: 'Unable to retrieve version info',
        });
        nodeCompat$.next({
            isCompatible: false,
            kibanaVersion: '2.1.1',
            incompatibleNodes: [nodeInfo],
            warningNodes: [],
            message: 'Incompatible with Elasticsearch',
        });
        nodeCompat$.next({
            isCompatible: true,
            kibanaVersion: '1.1.1',
            warningNodes: [nodeInfo],
            incompatibleNodes: [],
            message: 'Some nodes are incompatible',
        });
        nodeCompat$.next({
            isCompatible: true,
            kibanaVersion: '1.1.1',
            warningNodes: [],
            incompatibleNodes: [],
        });
        subscription.unsubscribe();
        expect(statusUpdates).toMatchInlineSnapshot(`
      Array [
        Object {
          "level": unavailable,
          "meta": Object {
            "incompatibleNodes": Array [],
            "warningNodes": Array [],
          },
          "summary": "Waiting for Elasticsearch",
        },
        Object {
          "level": critical,
          "meta": Object {
            "incompatibleNodes": Array [],
            "warningNodes": Array [],
          },
          "summary": "Unable to retrieve version info",
        },
        Object {
          "level": critical,
          "meta": Object {
            "incompatibleNodes": Array [
              Object {
                "http": Object {
                  "publish_address": "https://1.1.1.1:9200",
                },
                "ip": "1.1.1.1",
                "name": "node1",
                "version": "1.1.1",
              },
            ],
            "warningNodes": Array [],
          },
          "summary": "Incompatible with Elasticsearch",
        },
        Object {
          "level": degraded,
          "meta": Object {
            "incompatibleNodes": Array [],
            "warningNodes": Array [
              Object {
                "http": Object {
                  "publish_address": "https://1.1.1.1:9200",
                },
                "ip": "1.1.1.1",
                "name": "node1",
                "version": "1.1.1",
              },
            ],
          },
          "summary": "Some nodes are incompatible",
        },
        Object {
          "level": available,
          "meta": Object {
            "incompatibleNodes": Array [],
            "warningNodes": Array [],
          },
          "summary": "Elasticsearch is available",
        },
      ]
    `);
    });
});
