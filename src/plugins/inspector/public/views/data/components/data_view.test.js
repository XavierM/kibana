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
const react_1 = tslib_1.__importDefault(require("react"));
const index_1 = require("../index");
const data_1 = require("../../../../common/adapters/data");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
jest.mock('../lib/export_csv', () => ({
    exportAsCsv: jest.fn(),
}));
describe('Inspector Data View', () => {
    let DataView;
    beforeEach(() => {
        const uiSettings = {};
        DataView = index_1.getDataViewDescription(uiSettings);
    });
    it('should only show if data adapter is present', () => {
        const adapter = new data_1.DataAdapter();
        expect(DataView.shouldShow({ data: adapter })).toBe(true);
        expect(DataView.shouldShow({})).toBe(false);
    });
    describe('component', () => {
        let adapters;
        beforeEach(() => {
            adapters = { data: new data_1.DataAdapter() };
        });
        it('should render loading state', () => {
            const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(DataView.component, { title: "Test Data", adapters: adapters }));
            expect(component).toMatchSnapshot();
        });
        it('should render empty state', async () => {
            const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(DataView.component, { title: "Test Data", adapters: adapters }));
            const tabularLoader = Promise.resolve(null);
            adapters.data.setTabularLoader(() => tabularLoader);
            await tabularLoader;
            // After the loader has resolved we'll still need one update, to "flush" the state changes
            component.update();
            expect(component).toMatchSnapshot();
        });
    });
});
