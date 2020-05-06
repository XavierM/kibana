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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importStar(require("react"));
const public_1 = require("../../../../../../../es_ui_shared/public");
const contexts_1 = require("../../../../contexts");
const legacy_core_editor_1 = require("../../../../models/legacy_core_editor");
const subscribe_console_resize_checker_1 = require("../subscribe_console_resize_checker");
const apply_editor_settings_1 = require("./apply_editor_settings");
function modeForContentType(contentType) {
    if (!contentType) {
        return 'ace/mode/text';
    }
    if (contentType.indexOf('application/json') >= 0) {
        return 'ace/mode/json';
    }
    else if (contentType.indexOf('application/yaml') >= 0) {
        return 'ace/mode/yaml';
    }
    return 'ace/mode/text';
}
function EditorOutputUI() {
    const editorRef = react_1.useRef(null);
    const editorInstanceRef = react_1.useRef(null);
    const { services } = contexts_1.useServicesContext();
    const { settings: readOnlySettings } = contexts_1.useEditorReadContext();
    const { lastResult: { data, error }, } = contexts_1.useRequestReadContext();
    const inputId = 'ConAppOutputTextarea';
    react_1.useEffect(() => {
        editorInstanceRef.current = legacy_core_editor_1.createReadOnlyAceEditor(editorRef.current);
        const unsubscribe = subscribe_console_resize_checker_1.subscribeResizeChecker(editorRef.current, editorInstanceRef.current);
        const textarea = editorRef.current.querySelector('textarea');
        textarea.setAttribute('id', inputId);
        textarea.setAttribute('readonly', 'true');
        return () => {
            unsubscribe();
            editorInstanceRef.current.destroy();
        };
    }, [services.settings]);
    react_1.useEffect(() => {
        const editor = editorInstanceRef.current;
        if (data) {
            const mode = modeForContentType(data[0].response.contentType);
            editor.session.setMode(mode);
            editor.update(data
                .map(d => d.response.value)
                .map(readOnlySettings.tripleQuotes ? public_1.expandLiteralStrings : a => a)
                .join('\n'));
        }
        else if (error) {
            editor.session.setMode(modeForContentType(error.response.contentType));
            editor.update(error.response.value);
        }
        else {
            editor.update('');
        }
    }, [readOnlySettings, data, error]);
    react_1.useEffect(() => {
        apply_editor_settings_1.applyCurrentSettings(editorInstanceRef.current, readOnlySettings);
    }, [readOnlySettings]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
            react_1.default.createElement("label", { htmlFor: inputId }, i18n_1.i18n.translate('console.outputTextarea', {
                defaultMessage: 'Dev Tools Console output',
            }))),
        react_1.default.createElement("div", { ref: editorRef, className: "conApp__output", "data-test-subj": "response-editor" },
            react_1.default.createElement("div", { className: "conApp__outputContent", id: "ConAppOutput" }))));
}
exports.EditorOutput = react_1.default.memo(EditorOutputUI);
