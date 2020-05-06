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
const change_time_filter_1 = require("./change_time_filter");
const timefilter_service_mock_1 = require("../timefilter_service.mock");
const timefilterMock = timefilter_service_mock_1.timefilterServiceMock.createSetupContract();
const timefilter = timefilterMock.timefilter;
let _time;
timefilter.setTime.mockImplementation((time) => {
    _time = {
        from: time.from.toISOString(),
        to: time.to.toISOString(),
    };
});
timefilter.getTime.mockImplementation(() => {
    return _time;
});
describe('changeTimeFilter()', () => {
    const gt = 1388559600000;
    const lt = 1388646000000;
    test('should change the timefilter to match the range gt/lt', () => {
        const filter = { range: { '@timestamp': { gt, lt } } };
        change_time_filter_1.changeTimeFilter(timefilter, filter);
        const { to, from } = timefilter.getTime();
        expect(to).toBe(new Date(lt).toISOString());
        expect(from).toBe(new Date(gt).toISOString());
    });
    test('should change the timefilter to match the range gte/lte', () => {
        const filter = { range: { '@timestamp': { gte: gt, lte: lt } } };
        change_time_filter_1.changeTimeFilter(timefilter, filter);
        const { to, from } = timefilter.getTime();
        expect(to).toBe(new Date(lt).toISOString());
        expect(from).toBe(new Date(gt).toISOString());
    });
});
