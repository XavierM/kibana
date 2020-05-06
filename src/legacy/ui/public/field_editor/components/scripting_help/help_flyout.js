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
const eui_1 = require("@elastic/eui");
const scripting_syntax_1 = require("./scripting_syntax");
const test_script_1 = require("./test_script");
exports.ScriptingHelpFlyout = ({ isVisible = false, onClose = () => { }, indexPattern, lang, name, script, executeScript, getHttpStart, docLinksScriptedFields, }) => {
    const tabs = [
        {
            id: 'syntax',
            name: 'Syntax',
            ['data-test-subj']: 'syntaxTab',
            content: react_1.default.createElement(scripting_syntax_1.ScriptingSyntax, { docLinksScriptedFields: docLinksScriptedFields }),
        },
        {
            id: 'test',
            name: 'Preview results',
            ['data-test-subj']: 'testTab',
            content: (react_1.default.createElement(test_script_1.TestScript, { indexPattern: indexPattern, lang: lang, name: name, script: script, executeScript: executeScript, getHttpStart: getHttpStart })),
        },
    ];
    return isVisible ? (react_1.default.createElement(eui_1.EuiFlyout, { onClose: onClose, "data-test-subj": "scriptedFieldsHelpFlyout" },
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiTabbedContent, { tabs: tabs, initialSelectedTab: tabs[0] })))) : null;
};
exports.ScriptingHelpFlyout.displayName = 'ScriptingHelpFlyout';
