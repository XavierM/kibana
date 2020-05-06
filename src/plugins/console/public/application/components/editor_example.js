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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const help_example_txt_1 = tslib_1.__importDefault(require("raw-loader!../constants/help_example.txt"));
const react_1 = tslib_1.__importStar(require("react"));
const legacy_core_editor_1 = require("../models/legacy_core_editor");
function EditorExample(props) {
    const elemId = `help-example-${props.panel}`;
    const inputId = `help-example-${props.panel}-input`;
    react_1.useEffect(() => {
        const el = document.getElementById(elemId);
        el.textContent = help_example_txt_1.default.trim();
        const editor = legacy_core_editor_1.createReadOnlyAceEditor(el);
        const textarea = el.querySelector('textarea');
        textarea.setAttribute('id', inputId);
        textarea.setAttribute('readonly', 'true');
        return () => {
            editor.destroy();
        };
    }, [elemId, inputId]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
            react_1.default.createElement("label", { htmlFor: inputId }, i18n_1.i18n.translate('console.exampleOutputTextarea', {
                defaultMessage: 'Dev Tools Console editor example',
            }))),
        react_1.default.createElement("div", { id: elemId, className: "conHelp__example" })));
}
exports.EditorExample = EditorExample;
