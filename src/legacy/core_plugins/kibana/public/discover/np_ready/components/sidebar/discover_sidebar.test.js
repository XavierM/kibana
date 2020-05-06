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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
// @ts-ignore
const stub_index_pattern_1 = tslib_1.__importDefault(require("test_utils/stub_index_pattern"));
// @ts-ignore
const real_hits_js_1 = tslib_1.__importDefault(require("fixtures/real_hits.js"));
// @ts-ignore
const logstash_fields_1 = tslib_1.__importDefault(require("fixtures/logstash_fields"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const react_1 = tslib_1.__importDefault(require("react"));
const discover_sidebar_1 = require("./discover_sidebar");
const mocks_1 = require("../../../../../../../../core/public/mocks");
jest.mock('../../../kibana_services', () => ({
    getServices: () => ({
        history: () => ({
            location: {
                search: '',
            },
        }),
        capabilities: {
            visualize: {
                show: true,
            },
        },
        uiSettings: {
            get: (key) => {
                if (key === 'fields:popularLimit') {
                    return 5;
                }
                else if (key === 'shortDots:enable') {
                    return false;
                }
            },
        },
    }),
}));
function getCompProps() {
    const indexPattern = new stub_index_pattern_1.default('logstash-*', (cfg) => cfg, 'time', logstash_fields_1.default(), mocks_1.coreMock.createStart());
    const hits = lodash_1.default.each(lodash_1.default.cloneDeep(real_hits_js_1.default), indexPattern.flattenHit);
    const indexPatternList = [
        { id: '0', attributes: { title: 'b' } },
        { id: '1', attributes: { title: 'a' } },
        { id: '2', attributes: { title: 'c' } },
    ];
    const fieldCounts = {};
    for (const hit of hits) {
        for (const key of Object.keys(indexPattern.flattenHit(hit))) {
            fieldCounts[key] = (fieldCounts[key] || 0) + 1;
        }
    }
    return {
        columns: ['extension'],
        fieldCounts,
        hits,
        indexPatternList,
        onAddFilter: jest.fn(),
        onAddField: jest.fn(),
        onRemoveField: jest.fn(),
        selectedIndexPattern: indexPattern,
        setIndexPattern: jest.fn(),
        state: {},
    };
}
describe('discover sidebar', function () {
    let props;
    let comp;
    beforeAll(() => {
        props = getCompProps();
        comp = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(discover_sidebar_1.DiscoverSidebar, Object.assign({}, props)));
    });
    it('should have Selected Fields and Available Fields with Popular Fields sections', function () {
        const popular = test_1.findTestSubject(comp, 'fieldList-popular');
        const selected = test_1.findTestSubject(comp, 'fieldList-selected');
        const unpopular = test_1.findTestSubject(comp, 'fieldList-unpopular');
        expect(popular.children().length).toBe(1);
        expect(unpopular.children().length).toBe(7);
        expect(selected.children().length).toBe(1);
    });
    it('should allow selecting fields', function () {
        test_1.findTestSubject(comp, 'fieldToggle-bytes').simulate('click');
        expect(props.onAddField).toHaveBeenCalledWith('bytes');
    });
    it('should allow deselecting fields', function () {
        test_1.findTestSubject(comp, 'fieldToggle-extension').simulate('click');
        expect(props.onRemoveField).toHaveBeenCalledWith('extension');
    });
    it('should allow adding filters', function () {
        test_1.findTestSubject(comp, 'field-extension-showDetails').simulate('click');
        test_1.findTestSubject(comp, 'plus-extension-gif').simulate('click');
        expect(props.onAddFilter).toHaveBeenCalled();
    });
});
