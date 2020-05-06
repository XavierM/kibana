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
const rxjs_1 = require("rxjs");
const application_usage_1 = require("./application_usage");
describe('application_usage', () => {
    test('report an appId change', () => {
        const reporterMock = {
            reportApplicationUsage: jest.fn(),
        };
        const currentAppId$ = new rxjs_1.Subject();
        application_usage_1.reportApplicationUsage(currentAppId$, reporterMock);
        currentAppId$.next('appId');
        expect(reporterMock.reportApplicationUsage).toHaveBeenCalledWith('appId');
        expect(reporterMock.reportApplicationUsage).toHaveBeenCalledTimes(1);
    });
    test('skip duplicates', () => {
        const reporterMock = {
            reportApplicationUsage: jest.fn(),
        };
        const currentAppId$ = new rxjs_1.Subject();
        application_usage_1.reportApplicationUsage(currentAppId$, reporterMock);
        currentAppId$.next('appId');
        currentAppId$.next('appId');
        expect(reporterMock.reportApplicationUsage).toHaveBeenCalledWith('appId');
        expect(reporterMock.reportApplicationUsage).toHaveBeenCalledTimes(1);
    });
    test('skip if not a valid value', () => {
        const reporterMock = {
            reportApplicationUsage: jest.fn(),
        };
        const currentAppId$ = new rxjs_1.Subject();
        application_usage_1.reportApplicationUsage(currentAppId$, reporterMock);
        currentAppId$.next('');
        currentAppId$.next('kibana');
        currentAppId$.next(undefined);
        expect(reporterMock.reportApplicationUsage).toHaveBeenCalledTimes(0);
    });
});
