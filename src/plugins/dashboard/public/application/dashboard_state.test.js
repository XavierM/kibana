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
const history_1 = require("history");
const dashboard_state_manager_1 = require("./dashboard_state_manager");
const test_helpers_1 = require("./test_helpers");
const public_1 = require("src/plugins/embeddable/public");
const public_2 = require("src/plugins/kibana_utils/public");
describe('DashboardState', function () {
    let dashboardState;
    const savedDashboard = test_helpers_1.getSavedDashboardMock();
    let mockTime = { to: 'now', from: 'now-15m' };
    const mockTimefilter = {
        getTime: () => {
            return mockTime;
        },
        setTime: (time) => {
            mockTime = time;
        },
    };
    function initDashboardState() {
        dashboardState = new dashboard_state_manager_1.DashboardStateManager({
            savedDashboard,
            hideWriteControls: false,
            kibanaVersion: '7.0.0',
            kbnUrlStateStorage: public_2.createKbnUrlStateStorage(),
            history: history_1.createBrowserHistory(),
        });
    }
    describe('syncTimefilterWithDashboard', function () {
        test('syncs quick time', function () {
            savedDashboard.timeRestore = true;
            savedDashboard.timeFrom = 'now/w';
            savedDashboard.timeTo = 'now/w';
            mockTime.from = '2015-09-19 06:31:44.000';
            mockTime.to = '2015-09-29 06:31:44.000';
            initDashboardState();
            dashboardState.syncTimefilterWithDashboardTime(mockTimefilter);
            expect(mockTime.to).toBe('now/w');
            expect(mockTime.from).toBe('now/w');
        });
        test('syncs relative time', function () {
            savedDashboard.timeRestore = true;
            savedDashboard.timeFrom = 'now-13d';
            savedDashboard.timeTo = 'now';
            mockTime.from = '2015-09-19 06:31:44.000';
            mockTime.to = '2015-09-29 06:31:44.000';
            initDashboardState();
            dashboardState.syncTimefilterWithDashboardTime(mockTimefilter);
            expect(mockTime.to).toBe('now');
            expect(mockTime.from).toBe('now-13d');
        });
        test('syncs absolute time', function () {
            savedDashboard.timeRestore = true;
            savedDashboard.timeFrom = '2015-09-19 06:31:44.000';
            savedDashboard.timeTo = '2015-09-29 06:31:44.000';
            mockTime.from = 'now/w';
            mockTime.to = 'now/w';
            initDashboardState();
            dashboardState.syncTimefilterWithDashboardTime(mockTimefilter);
            expect(mockTime.to).toBe(savedDashboard.timeTo);
            expect(mockTime.from).toBe(savedDashboard.timeFrom);
        });
    });
    describe('isDirty', function () {
        beforeAll(() => {
            initDashboardState();
        });
        test('getIsDirty is true if isDirty is true and editing', () => {
            dashboardState.switchViewMode(public_1.ViewMode.EDIT);
            dashboardState.isDirty = true;
            expect(dashboardState.getIsDirty()).toBeTruthy();
        });
        test('getIsDirty is false if isDirty is true and editing', () => {
            dashboardState.switchViewMode(public_1.ViewMode.VIEW);
            dashboardState.isDirty = true;
            expect(dashboardState.getIsDirty()).toBeFalsy();
        });
    });
});
