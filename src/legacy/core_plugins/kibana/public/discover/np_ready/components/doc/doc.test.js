"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const test_utils_1 = require("react-dom/test-utils");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
const doc_1 = require("./doc");
jest.mock('../../../kibana_services', () => {
    return {
        getServices: () => ({
            metadata: {
                branch: 'test',
            },
            DocViewer: () => null,
        }),
    };
});
beforeEach(() => {
    jest.clearAllMocks();
});
const waitForPromises = async () => test_utils_1.act(async () => {
    await new Promise(resolve => setTimeout(resolve));
});
/**
 * this works but logs ugly error messages until we're using React 16.9
 * should be adapted when we upgrade
 */
async function mountDoc(search, update = false, indexPatternGetter = null) {
    const indexPattern = {
        getComputedFields: () => [],
    };
    const indexPatternService = {
        get: indexPatternGetter ? indexPatternGetter : jest.fn(() => Promise.resolve(indexPattern)),
    };
    const props = {
        id: '1',
        index: 'index1',
        esClient: { search },
        indexPatternId: 'xyz',
        indexPatternService,
    };
    let comp;
    await test_utils_1.act(async () => {
        comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(doc_1.Doc, Object.assign({}, props)));
        if (update)
            comp.update();
    });
    if (update) {
        await waitForPromises();
        comp.update();
    }
    return comp;
}
describe('Test of <Doc /> of Discover', () => {
    test('renders loading msg', async () => {
        const comp = await mountDoc(jest.fn());
        expect(test_1.findTestSubject(comp, 'doc-msg-loading').length).toBe(1);
    });
    test('renders IndexPattern notFound msg', async () => {
        const indexPatternGetter = jest.fn(() => Promise.reject({ savedObjectId: '007' }));
        const comp = await mountDoc(jest.fn(), true, indexPatternGetter);
        expect(test_1.findTestSubject(comp, 'doc-msg-notFoundIndexPattern').length).toBe(1);
    });
    test('renders notFound msg', async () => {
        const search = jest.fn(() => Promise.reject({ status: 404 }));
        const comp = await mountDoc(search, true);
        expect(test_1.findTestSubject(comp, 'doc-msg-notFound').length).toBe(1);
    });
    test('renders error msg', async () => {
        const search = jest.fn(() => Promise.reject('whatever'));
        const comp = await mountDoc(search, true);
        expect(test_1.findTestSubject(comp, 'doc-msg-error').length).toBe(1);
    });
    test('renders elasticsearch hit ', async () => {
        const hit = { hits: { total: 1, hits: [{ _id: 1, _source: { test: 1 } }] } };
        const search = jest.fn(() => Promise.resolve(hit));
        const comp = await mountDoc(search, true);
        expect(test_1.findTestSubject(comp, 'doc-hit').length).toBe(1);
    });
});
