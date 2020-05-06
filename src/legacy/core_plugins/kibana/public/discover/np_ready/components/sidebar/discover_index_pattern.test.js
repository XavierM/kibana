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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const change_indexpattern_1 = require("./change_indexpattern");
const discover_index_pattern_1 = require("./discover_index_pattern");
const eui_1 = require("@elastic/eui");
const indexPattern = {
    id: 'test1',
    title: 'test1 title',
};
const indexPattern1 = {
    id: 'test1',
    attributes: {
        title: 'test1 title',
    },
};
const indexPattern2 = {
    id: 'test2',
    attributes: {
        title: 'test2 title',
    },
};
const defaultProps = {
    indexPatternList: [indexPattern1, indexPattern2],
    selectedIndexPattern: indexPattern,
    setIndexPattern: jest.fn(async () => { }),
};
function getIndexPatternPickerList(instance) {
    return instance
        .find(change_indexpattern_1.ChangeIndexPattern)
        .first()
        .dive()
        .find(eui_1.EuiSelectable);
}
function getIndexPatternPickerOptions(instance) {
    return getIndexPatternPickerList(instance)
        .dive()
        .find(eui_1.EuiSelectableList)
        .prop('options');
}
function selectIndexPatternPickerOption(instance, selectedLabel) {
    const options = getIndexPatternPickerOptions(instance).map((option) => option.label === selectedLabel
        ? { ...option, checked: 'on' }
        : { ...option, checked: undefined });
    return getIndexPatternPickerList(instance).prop('onChange')(options);
}
describe('DiscoverIndexPattern', () => {
    test('Invalid props dont cause an exception', () => {
        const props = {
            indexPatternList: null,
            selectedIndexPattern: null,
            setIndexPattern: jest.fn(),
        };
        expect(enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(discover_index_pattern_1.DiscoverIndexPattern, Object.assign({}, props)))).toMatchSnapshot(`""`);
    });
    test('should list all index patterns', () => {
        const instance = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(discover_index_pattern_1.DiscoverIndexPattern, Object.assign({}, defaultProps)));
        expect(getIndexPatternPickerOptions(instance).map((option) => option.label)).toEqual([
            'test1 title',
            'test2 title',
        ]);
    });
    test('should switch data panel to target index pattern', () => {
        const instance = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(discover_index_pattern_1.DiscoverIndexPattern, Object.assign({}, defaultProps)));
        selectIndexPatternPickerOption(instance, 'test2 title');
        expect(defaultProps.setIndexPattern).toHaveBeenCalledWith('test2');
    });
});
