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
const tslib_1 = require("tslib");
jest.mock('getos', () => (cb) => cb(null, { dist: 'distrib', release: 'release' }));
const os_1 = tslib_1.__importDefault(require("os"));
const os_2 = require("./os");
describe('OsMetricsCollector', () => {
    let collector;
    beforeEach(() => {
        collector = new os_2.OsMetricsCollector();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('collects platform info from the os package', async () => {
        const platform = 'darwin';
        const release = '10.14.1';
        jest.spyOn(os_1.default, 'platform').mockImplementation(() => platform);
        jest.spyOn(os_1.default, 'release').mockImplementation(() => release);
        const metrics = await collector.collect();
        expect(metrics.platform).toBe(platform);
        expect(metrics.platformRelease).toBe(`${platform}-${release}`);
    });
    it('collects distribution info when platform is linux', async () => {
        const platform = 'linux';
        jest.spyOn(os_1.default, 'platform').mockImplementation(() => platform);
        const metrics = await collector.collect();
        expect(metrics.distro).toBe('distrib');
        expect(metrics.distroRelease).toBe('distrib-release');
    });
    it('collects memory info from the os package', async () => {
        const totalMemory = 1457886;
        const freeMemory = 456786;
        jest.spyOn(os_1.default, 'totalmem').mockImplementation(() => totalMemory);
        jest.spyOn(os_1.default, 'freemem').mockImplementation(() => freeMemory);
        const metrics = await collector.collect();
        expect(metrics.memory.total_in_bytes).toBe(totalMemory);
        expect(metrics.memory.free_in_bytes).toBe(freeMemory);
        expect(metrics.memory.used_in_bytes).toBe(totalMemory - freeMemory);
    });
    it('collects uptime info from the os package', async () => {
        const uptime = 325;
        jest.spyOn(os_1.default, 'uptime').mockImplementation(() => uptime);
        const metrics = await collector.collect();
        expect(metrics.uptime_in_millis).toBe(uptime * 1000);
    });
    it('collects load info from the os package', async () => {
        const oneMinLoad = 1;
        const fiveMinLoad = 2;
        const fifteenMinLoad = 3;
        jest.spyOn(os_1.default, 'loadavg').mockImplementation(() => [oneMinLoad, fiveMinLoad, fifteenMinLoad]);
        const metrics = await collector.collect();
        expect(metrics.load).toEqual({
            '1m': oneMinLoad,
            '5m': fiveMinLoad,
            '15m': fifteenMinLoad,
        });
    });
});
