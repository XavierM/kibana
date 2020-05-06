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
/* eslint-env jest */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// eslint-disable-next-line max-classes-per-file
const events_1 = tslib_1.__importDefault(require("events"));
const lodash_1 = require("lodash");
const bluebird_1 = require("bluebird");
class MockClusterFork extends events_1.default {
    constructor(cluster) {
        super();
        this.exitCode = 0;
        let dead = true;
        function wait() {
            return bluebird_1.delay(lodash_1.random(10, 250));
        }
        lodash_1.assign(this, {
            process: {
                kill: jest.fn(() => {
                    (async () => {
                        await wait();
                        this.emit('disconnect');
                        await wait();
                        dead = true;
                        this.emit('exit');
                        cluster.emit('exit', this, this.exitCode || 0);
                    })();
                }),
            },
            isDead: jest.fn(() => dead),
            send: jest.fn(),
        });
        jest.spyOn(this, 'on');
        jest.spyOn(this, 'off');
        jest.spyOn(this, 'emit');
        (async () => {
            await wait();
            dead = false;
            this.emit('online');
        })();
    }
}
class MockCluster extends events_1.default {
    constructor() {
        super(...arguments);
        this.fork = jest.fn(() => new MockClusterFork(this));
        this.setupMaster = jest.fn();
    }
}
exports.MockCluster = MockCluster;
