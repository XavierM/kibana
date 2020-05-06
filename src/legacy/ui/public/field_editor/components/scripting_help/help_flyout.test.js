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
const enzyme_1 = require("enzyme");
// eslint-disable-next-line
const doc_links_service_mock_1 = require("../../../../../../core/public/doc_links/doc_links_service.mock");
const help_flyout_1 = require("./help_flyout");
jest.mock('./test_script', () => ({
    TestScript: () => {
        return `<div>mockTestScript</div>`;
    },
}));
const indexPatternMock = {};
describe('ScriptingHelpFlyout', () => {
    const docLinksScriptedFields = doc_links_service_mock_1.docLinksServiceMock.createStartContract().links.scriptedFields;
    it('should render normally', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(help_flyout_1.ScriptingHelpFlyout, { isVisible: true, indexPattern: indexPatternMock, lang: "painless", executeScript: (() => { }), onClose: () => { }, getHttpStart: () => ({}), 
            // docLinksScriptedFields={docLinksScriptedFields}
            docLinksScriptedFields: {} }));
        expect(component).toMatchSnapshot();
    });
    it('should render nothing if not visible', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(help_flyout_1.ScriptingHelpFlyout, { isVisible: true, indexPattern: indexPatternMock, lang: "painless", executeScript: (() => { }), onClose: () => { }, getHttpStart: () => ({}), docLinksScriptedFields: {} }));
        expect(component).toMatchSnapshot();
    });
});
