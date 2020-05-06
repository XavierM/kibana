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
const language_switcher_1 = require("./language_switcher");
const public_1 = require("src/plugins/kibana_react/public");
const mocks_1 = require("../../../../../core/public/mocks");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const eui_1 = require("@elastic/eui");
const startMock = mocks_1.coreMock.createStart();
describe('LanguageSwitcher', () => {
    function wrapInContext(testProps) {
        const services = {
            uiSettings: startMock.uiSettings,
            docLinks: startMock.docLinks,
        };
        return (react_1.default.createElement(public_1.KibanaContextProvider, { services: services },
            react_1.default.createElement(language_switcher_1.QueryLanguageSwitcher, Object.assign({}, testProps))));
    }
    it('should toggle off if language is lucene', () => {
        const component = enzyme_helpers_1.mountWithIntl(wrapInContext({
            language: 'lucene',
            onSelectLanguage: () => {
                return;
            },
        }));
        component.find(eui_1.EuiButtonEmpty).simulate('click');
        expect(component.find(eui_1.EuiPopover).prop('isOpen')).toBe(true);
        expect(component.find('[data-test-subj="languageToggle"]').get(0).props.checked).toBeFalsy();
    });
    it('should toggle on if language is kuery', () => {
        const component = enzyme_helpers_1.mountWithIntl(wrapInContext({
            language: 'kuery',
            onSelectLanguage: () => {
                return;
            },
        }));
        component.find(eui_1.EuiButtonEmpty).simulate('click');
        expect(component.find(eui_1.EuiPopover).prop('isOpen')).toBe(true);
        expect(component.find('[data-test-subj="languageToggle"]').get(0).props.checked).toBeTruthy();
    });
});
