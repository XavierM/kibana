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
require("./editor.test.mock");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const react_2 = require("@kbn/i18n/react");
const test_utils_1 = require("react-dom/test-utils");
const sinon = tslib_1.__importStar(require("sinon"));
const services_context_mock_1 = require("../../../../contexts/services_context.mock");
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const contexts_1 = require("../../../../contexts");
// Mocked functions
const send_request_to_es_1 = require("../../../../hooks/use_send_current_request_to_es/send_request_to_es");
const get_endpoint_from_position_1 = require("../../../../../lib/autocomplete/get_endpoint_from_position");
const consoleMenuActions = tslib_1.__importStar(require("../console_menu_actions"));
const editor_1 = require("./editor");
describe('Legacy (Ace) Console Editor Component Smoke Test', () => {
    let mockedAppContextValue;
    const sandbox = sinon.createSandbox();
    const doMount = () => enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(contexts_1.ServicesContextProvider, { value: mockedAppContextValue },
            react_1.default.createElement(contexts_1.RequestContextProvider, null,
                react_1.default.createElement(contexts_1.EditorContextProvider, { settings: {} },
                    react_1.default.createElement(editor_1.Editor, { initialTextValue: "" }))))));
    beforeEach(() => {
        document.queryCommandSupported = sinon.fake(() => true);
        mockedAppContextValue = services_context_mock_1.serviceContextMock.create();
    });
    afterEach(() => {
        jest.clearAllMocks();
        sandbox.restore();
    });
    it('calls send current request to ES', async () => {
        get_endpoint_from_position_1.getEndpointFromPosition.mockReturnValue({ patterns: [] });
        send_request_to_es_1.sendRequestToES.mockRejectedValue({});
        const editor = doMount();
        test_utils_1.act(() => {
            editor.find('[data-test-subj~="sendRequestButton"]').simulate('click');
        });
        await enzyme_helpers_1.nextTick();
        expect(send_request_to_es_1.sendRequestToES).toBeCalledTimes(1);
    });
    it('opens docs', () => {
        const stub = sandbox.stub(consoleMenuActions, 'getDocumentation');
        const editor = doMount();
        const consoleMenuToggle = editor.find('[data-test-subj~="toggleConsoleMenu"]').last();
        consoleMenuToggle.simulate('click');
        const docsButton = editor.find('[data-test-subj~="consoleMenuOpenDocs"]').last();
        docsButton.simulate('click');
        expect(stub.callCount).toBe(1);
    });
    it('prompts auto-indent', () => {
        const stub = sandbox.stub(consoleMenuActions, 'autoIndent');
        const editor = doMount();
        const consoleMenuToggle = editor.find('[data-test-subj~="toggleConsoleMenu"]').last();
        consoleMenuToggle.simulate('click');
        const autoIndentButton = editor.find('[data-test-subj~="consoleMenuAutoIndent"]').last();
        autoIndentButton.simulate('click');
        expect(stub.callCount).toBe(1);
    });
});
