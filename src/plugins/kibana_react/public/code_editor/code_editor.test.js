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
const code_editor_1 = require("./code_editor");
const monaco_1 = require("@kbn/ui-shared-deps/monaco");
const enzyme_1 = require("enzyme");
require("monaco-editor/esm/vs/basic-languages/html/html.contribution.js");
// A sample language definition with a few example tokens
const simpleLogLang = {
    tokenizer: {
        root: [
            [/\[error.*/, 'constant'],
            [/\[notice.*/, 'variable'],
            [/\[info.*/, 'string'],
            [/\[[a-zA-Z 0-9:]+\]/, 'tag'],
        ],
    },
};
monaco_1.monaco.languages.register({ id: 'loglang' });
monaco_1.monaco.languages.setMonarchTokensProvider('loglang', simpleLogLang);
const logs = `
[Sun Mar 7 20:54:27 2004] [notice] [client xx.xx.xx.xx] This is a notice!
[Sun Mar 7 20:58:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed
[Sun Mar 7 21:16:17 2004] [error] [client xx.xx.xx.xx] File does not exist: /home/httpd/twiki/view/Main/WebHome
`;
test('is rendered', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", height: 250, value: logs, onChange: () => { } }));
    expect(component).toMatchSnapshot();
});
test('editor mount setup', () => {
    const suggestionProvider = {
        provideCompletionItems: (model, position) => ({
            suggestions: [],
        }),
    };
    const signatureProvider = {
        provideSignatureHelp: () => ({ signatures: [], activeParameter: 0, activeSignature: 0 }),
    };
    const hoverProvider = {
        provideHover: (model, position) => ({
            contents: [],
        }),
    };
    const editorWillMount = jest.fn();
    monaco_1.monaco.languages.onLanguage = jest.fn((languageId, func) => {
        expect(languageId).toBe('loglang');
        // Call the function immediately so we can see our providers
        // get setup without a monaco editor setting up completely
        func();
    });
    monaco_1.monaco.languages.registerCompletionItemProvider = jest.fn();
    monaco_1.monaco.languages.registerSignatureHelpProvider = jest.fn();
    monaco_1.monaco.languages.registerHoverProvider = jest.fn();
    monaco_1.monaco.editor.defineTheme = jest.fn();
    const wrapper = enzyme_1.shallow(react_1.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", value: logs, onChange: () => { }, editorWillMount: editorWillMount, suggestionProvider: suggestionProvider, signatureProvider: signatureProvider, hoverProvider: hoverProvider }));
    const instance = wrapper.instance();
    instance._editorWillMount(monaco_1.monaco);
    // Verify our mount callback will be called
    expect(editorWillMount.mock.calls.length).toBe(1);
    // Verify our theme will be setup
    expect(monaco_1.monaco.editor.defineTheme.mock.calls.length).toBe(1);
    // Verify our language features have been registered
    expect(monaco_1.monaco.languages.onLanguage.mock.calls.length).toBe(1);
    expect(monaco_1.monaco.languages.registerCompletionItemProvider.mock.calls.length).toBe(1);
    expect(monaco_1.monaco.languages.registerSignatureHelpProvider.mock.calls.length).toBe(1);
    expect(monaco_1.monaco.languages.registerHoverProvider.mock.calls.length).toBe(1);
});
