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
const lodash_1 = require("lodash");
const query_string_1 = require("query-string");
const react_1 = tslib_1.__importStar(require("react"));
const public_1 = require("../../../../../../../es_ui_shared/public");
// @ts-ignore
const mappings_1 = tslib_1.__importDefault(require("../../../../../lib/mappings/mappings"));
const components_1 = require("../../../../components");
const contexts_1 = require("../../../../contexts");
const hooks_1 = require("../../../../hooks");
const senseEditor = tslib_1.__importStar(require("../../../../models/sense_editor"));
const console_menu_actions_1 = require("../console_menu_actions");
const subscribe_console_resize_checker_1 = require("../subscribe_console_resize_checker");
const apply_editor_settings_1 = require("./apply_editor_settings");
const keyboard_shortcuts_1 = require("./keyboard_shortcuts");
const abs = {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
};
const DEFAULT_INPUT_VALUE = `GET _search
{
  "query": {
    "match_all": {}
  }
}`;
const inputId = 'ConAppInputTextarea';
function EditorUI({ initialTextValue }) {
    const { services: { history, notifications, settings: settingsService }, docLinkVersion, elasticsearchUrl, } = contexts_1.useServicesContext();
    const { settings } = contexts_1.useEditorReadContext();
    const setInputEditor = hooks_1.useSetInputEditor();
    const sendCurrentRequestToES = hooks_1.useSendCurrentRequestToES();
    const saveCurrentTextObject = hooks_1.useSaveCurrentTextObject();
    const editorRef = react_1.useRef(null);
    const editorInstanceRef = react_1.useRef(null);
    const [textArea, setTextArea] = react_1.useState(null);
    public_1.useUIAceKeyboardMode(textArea);
    const openDocumentation = react_1.useCallback(async () => {
        const documentation = await console_menu_actions_1.getDocumentation(editorInstanceRef.current, docLinkVersion);
        if (!documentation) {
            return;
        }
        window.open(documentation, '_blank');
    }, [docLinkVersion]);
    react_1.useEffect(() => {
        editorInstanceRef.current = senseEditor.create(editorRef.current);
        const editor = editorInstanceRef.current;
        const textareaElement = editorRef.current.querySelector('textarea');
        if (textareaElement) {
            textareaElement.setAttribute('id', inputId);
        }
        const readQueryParams = () => {
            const [, queryString] = (window.location.hash || '').split('?');
            return query_string_1.parse(queryString || '', { sort: false });
        };
        const loadBufferFromRemote = (url) => {
            if (/^https?:\/\//.test(url)) {
                const loadFrom = {
                    url,
                    // Having dataType here is required as it doesn't allow jQuery to `eval` content
                    // coming from the external source thereby preventing XSS attack.
                    dataType: 'text',
                    kbnXsrfToken: false,
                };
                if (/https?:\/\/api\.github\.com/.test(url)) {
                    loadFrom.headers = { Accept: 'application/vnd.github.v3.raw' };
                }
                // Fire and forget.
                $.ajax(loadFrom).done(async (data) => {
                    const coreEditor = editor.getCoreEditor();
                    await editor.update(data, true);
                    editor.moveToNextRequestEdge(false);
                    coreEditor.clearSelection();
                    editor.highlightCurrentRequestsAndUpdateActionBar();
                    coreEditor.getContainer().focus();
                });
            }
        };
        // Support for loading a console snippet from a remote source, like support docs.
        const onHashChange = lodash_1.debounce(() => {
            const { load_from: url } = readQueryParams();
            if (!url) {
                return;
            }
            loadBufferFromRemote(url);
        }, 200);
        window.addEventListener('hashchange', onHashChange);
        const initialQueryParams = readQueryParams();
        if (initialQueryParams.load_from) {
            loadBufferFromRemote(initialQueryParams.load_from);
        }
        else {
            editor.update(initialTextValue || DEFAULT_INPUT_VALUE);
        }
        function setupAutosave() {
            let timer;
            const saveDelay = 500;
            editor.getCoreEditor().on('change', () => {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = window.setTimeout(saveCurrentState, saveDelay);
            });
        }
        function saveCurrentState() {
            try {
                const content = editor.getCoreEditor().getValue();
                saveCurrentTextObject(content);
            }
            catch (e) {
                // Ignoring saving error
            }
        }
        setInputEditor(editor);
        setTextArea(editorRef.current.querySelector('textarea'));
        mappings_1.default.retrieveAutoCompleteInfo(settingsService, settingsService.getAutocomplete());
        const unsubscribeResizer = subscribe_console_resize_checker_1.subscribeResizeChecker(editorRef.current, editor);
        setupAutosave();
        return () => {
            unsubscribeResizer();
            mappings_1.default.clearSubscriptions();
            window.removeEventListener('hashchange', onHashChange);
        };
    }, [saveCurrentTextObject, initialTextValue, history, setInputEditor, settingsService]);
    react_1.useEffect(() => {
        const { current: editor } = editorInstanceRef;
        apply_editor_settings_1.applyCurrentSettings(editor.getCoreEditor(), settings);
        // Preserve legacy focus behavior after settings have updated.
        editor
            .getCoreEditor()
            .getContainer()
            .focus();
    }, [settings]);
    react_1.useEffect(() => {
        keyboard_shortcuts_1.registerCommands({
            senseEditor: editorInstanceRef.current,
            sendCurrentRequestToES,
            openDocumentation,
        });
    }, [sendCurrentRequestToES, openDocumentation]);
    return (react_1.default.createElement("div", { style: abs, className: "conApp" },
        react_1.default.createElement("div", { className: "conApp__editor" },
            react_1.default.createElement("ul", { className: "conApp__autoComplete", id: "autocomplete" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { className: "conApp__editorActions", id: "ConAppEditorActions", gutterSize: "none", responsive: false },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiToolTip, { content: i18n_1.i18n.translate('console.sendRequestButtonTooltip', {
                            defaultMessage: 'Click to send request',
                        }) },
                        react_1.default.createElement("button", { onClick: sendCurrentRequestToES, "data-test-subj": "sendRequestButton", "aria-label": i18n_1.i18n.translate('console.sendRequestButtonTooltip', {
                                defaultMessage: 'Click to send request',
                            }), className: "conApp__editorActionButton conApp__editorActionButton--success" },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "play" })))),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(components_1.ConsoleMenu, { getCurl: () => {
                            return editorInstanceRef.current.getRequestsAsCURL(elasticsearchUrl);
                        }, getDocumentation: () => {
                            return console_menu_actions_1.getDocumentation(editorInstanceRef.current, docLinkVersion);
                        }, autoIndent: (event) => {
                            console_menu_actions_1.autoIndent(editorInstanceRef.current, event);
                        }, addNotification: ({ title }) => notifications.toasts.add({ title }) }))),
            react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
                react_1.default.createElement("label", { htmlFor: inputId }, i18n_1.i18n.translate('console.inputTextarea', {
                    defaultMessage: 'Dev Tools Console',
                }))),
            react_1.default.createElement("div", { ref: editorRef, id: "ConAppEditor", className: "conApp__editorContent", "data-test-subj": "request-editor" }))));
}
exports.Editor = react_1.default.memo(EditorUI);
