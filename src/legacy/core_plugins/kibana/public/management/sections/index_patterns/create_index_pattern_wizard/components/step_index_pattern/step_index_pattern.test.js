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
const step_index_pattern_1 = require("../step_index_pattern");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const header_1 = require("./components/header");
const public_1 = require("../../../../../../../../../../plugins/index_pattern_management/public");
const mocks_1 = require("../../../../../../../../../../core/public/mocks");
const mocks_2 = require("../../../../../../../../../../plugins/data/public/mocks");
jest.mock('../../lib/ensure_minimum_time', () => ({
    ensureMinimumTime: async (promises) => Array.isArray(promises) ? await Promise.all(promises) : await promises,
}));
const mockIndexPatternCreationType = new public_1.IndexPatternCreationConfig({
    type: 'default',
    name: 'name',
});
jest.mock('../../lib/get_indices', () => ({
    getIndices: ({}, {}, query) => {
        if (query.startsWith('e')) {
            return [{ name: 'es' }];
        }
        return [{ name: 'kibana' }];
    },
}));
const allIndices = [
    { name: 'kibana', tags: [] },
    { name: 'es', tags: [] },
];
const goToNextStep = () => { };
const savedObjectClient = mocks_1.coreMock.createStart().savedObjects.client;
savedObjectClient.find = () => new Promise(() => ({ savedObjects: [] }));
const uiSettings = mocks_1.coreMock.createSetup().uiSettings;
uiSettings.get.mockReturnValue('');
const createComponent = (props) => {
    return enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(step_index_pattern_1.StepIndexPattern, Object.assign({ allIndices: allIndices, isIncludingSystemIndices: false, esService: mocks_2.dataPluginMock.createStartContract().search.__LEGACY.esClient, savedObjectsClient: savedObjectClient, goToNextStep: goToNextStep, indexPatternCreationType: mockIndexPatternCreationType, uiSettings: uiSettings }, props)));
};
describe('StepIndexPattern', () => {
    it('renders the loading state', () => {
        const component = createComponent();
        component.setState({ isLoadingIndices: true });
        expect(component.find('[data-test-subj="createIndexPatternStep1Loading"]')).toMatchSnapshot();
    });
    it('renders indices which match the initial query', async () => {
        const component = createComponent({ initialQuery: 'kibana' });
        // Ensure all promises resolve
        await new Promise(resolve => process.nextTick(resolve));
        // Ensure the state changes are reflected
        await component.update();
        expect(component.find('[data-test-subj="createIndexPatternStep1IndicesList"]')).toMatchSnapshot();
    });
    it('renders errors when input is invalid', async () => {
        const component = createComponent();
        const instance = component.instance();
        instance.onQueryChanged({ target: { value: '?' } });
        // Ensure all promises resolve
        await new Promise(resolve => process.nextTick(resolve));
        // Ensure the state changes are reflected
        component.update();
        expect({
            component: component.find('[data-test-subj="createIndexPatternStep1Header"]'),
        }).toMatchSnapshot();
    });
    it('renders matching indices when input is valid', async () => {
        const component = createComponent();
        const instance = component.instance();
        instance.onQueryChanged({ target: { value: 'k' } });
        // Ensure all promises resolve
        await new Promise(resolve => process.nextTick(resolve));
        // Ensure the state changes are reflected
        component.update();
        expect(component.find('[data-test-subj="createIndexPatternStep1IndicesList"]')).toMatchSnapshot();
    });
    it('appends a wildcard automatically to queries', async () => {
        const component = createComponent();
        const instance = component.instance();
        instance.onQueryChanged({ target: { value: 'k' } });
        expect(component.state('query')).toBe('k*');
    });
    it('disables the next step if the index pattern exists', async () => {
        const component = createComponent();
        component.setState({ indexPatternExists: true });
        expect(component.find(header_1.Header).prop('isNextStepDisabled')).toBe(true);
    });
    it('ensures the response of the latest request is persisted', async () => {
        const component = createComponent();
        const instance = component.instance();
        instance.onQueryChanged({ target: { value: 'e' } });
        instance.lastQuery = 'k';
        await new Promise(resolve => process.nextTick(resolve));
        // Honesty, the state would match the result of the `k` query but
        // it's hard to mock this in tests but if remove our fix
        // (the early return if the queries do not match) then this
        // equals [{name: 'es'}]
        expect(component.state('exactMatchedIndices')).toEqual([]);
        // Ensure it works in the other code flow too (the other early return)
        // Provide `es` so we do not auto append * and enter our other code flow
        instance.onQueryChanged({ target: { value: 'es' } });
        instance.lastQuery = 'k';
        await new Promise(resolve => process.nextTick(resolve));
        expect(component.state('exactMatchedIndices')).toEqual([]);
    });
});
