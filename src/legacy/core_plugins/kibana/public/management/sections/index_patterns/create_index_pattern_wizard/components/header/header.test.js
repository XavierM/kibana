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
const header_1 = require("../header");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
describe('Header', () => {
    const indexPatternName = 'test index pattern';
    it('should render normally', () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(header_1.Header, { indexPatternName: indexPatternName, isIncludingSystemIndices: true, onChangeIncludingSystemIndices: () => { } }));
        expect(component).toMatchSnapshot();
    });
    it('should render without including system indices', () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(header_1.Header, { indexPatternName: indexPatternName, isIncludingSystemIndices: false, onChangeIncludingSystemIndices: () => { } }));
        expect(component).toMatchSnapshot();
    });
    it('should render a different name, prompt, and beta tag if provided', () => {
        const component = enzyme_helpers_1.shallowWithI18nProvider(react_1.default.createElement(header_1.Header, { isIncludingSystemIndices: false, onChangeIncludingSystemIndices: () => { }, prompt: react_1.default.createElement("div", null, "Test prompt"), indexPatternName: indexPatternName, isBeta: true }));
        expect(component).toMatchSnapshot();
    });
});
