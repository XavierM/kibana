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
const addon_actions_1 = require("@storybook/addon-actions");
const react_1 = require("@storybook/react");
const react_2 = tslib_1.__importDefault(require("react"));
const monaco_1 = require("@kbn/ui-shared-deps/monaco");
const code_editor_1 = require("./code_editor");
// A sample language definition with a few example tokens
// Taken from https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages
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
const logs = `[Sun Mar 7 20:54:27 2004] [notice] [client xx.xx.xx.xx] This is a notice!
[Sun Mar 7 20:58:27 2004] [info] [client xx.xx.xx.xx] (104)Connection reset by peer: client stopped connection before send body completed
[Sun Mar 7 21:16:17 2004] [error] [client xx.xx.xx.xx] File does not exist: /home/httpd/twiki/view/Main/WebHome
`;
react_1.storiesOf('CodeEditor', module)
    .addParameters({
    info: {
        // CodeEditor has no PropTypes set so this table will show up
        // as blank. I'm just disabling it to reduce confusion
        propTablesExclude: [code_editor_1.CodeEditor],
    },
})
    .add('default', () => (react_2.default.createElement("div", null,
    react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "plaintext", height: 250, value: "Hello!", onChange: addon_actions_1.action('onChange') }))), {
    info: {
        text: 'Plaintext Monaco Editor',
    },
})
    .add('dark mode', () => (react_2.default.createElement("div", null,
    react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "plaintext", height: 250, value: "Hello!", onChange: addon_actions_1.action('onChange'), useDarkTheme: true }))), {
    info: {
        text: 'The dark theme is automatically used when dark mode is enabled in Kibana',
    },
})
    .add('custom log language', () => (react_2.default.createElement("div", null,
    react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", height: 250, value: logs, onChange: addon_actions_1.action('onChange') }))), {
    info: {
        text: 'Custom language example. Language definition taken from [here](https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages)',
    },
})
    .add('hide minimap', () => (react_2.default.createElement("div", null,
    react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", height: 250, value: logs, onChange: addon_actions_1.action('onChange'), options: {
            minimap: {
                enabled: false,
            },
        } }))), {
    info: {
        text: 'The minimap (on left side of editor) can be disabled to save space',
    },
})
    .add('suggestion provider', () => {
    const provideSuggestions = (model, position, context) => {
        const wordRange = new monaco_1.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
        return {
            suggestions: [
                {
                    label: 'Hello, World',
                    kind: monaco_1.monaco.languages.CompletionItemKind.Variable,
                    documentation: {
                        value: '*Markdown* can be used in autocomplete help',
                        isTrusted: true,
                    },
                    insertText: 'Hello, World',
                    range: wordRange,
                },
                {
                    label: 'You know, for search',
                    kind: monaco_1.monaco.languages.CompletionItemKind.Variable,
                    documentation: { value: 'Thanks `Monaco`', isTrusted: true },
                    insertText: 'You know, for search',
                    range: wordRange,
                },
            ],
        };
    };
    return (react_2.default.createElement("div", null,
        react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", height: 250, value: logs, onChange: addon_actions_1.action('onChange'), suggestionProvider: {
                triggerCharacters: ['.'],
                provideCompletionItems: provideSuggestions,
            }, options: {
                wordBasedSuggestions: false,
                quickSuggestions: true,
            } })));
}, {
    info: {
        text: 'Example suggestion provider is triggered by the `.` character',
    },
})
    .add('hover provider', () => {
    const provideHover = (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) {
            return {
                contents: [],
            };
        }
        return {
            contents: [
                {
                    value: `You're hovering over **${word.word}**`,
                },
            ],
        };
    };
    return (react_2.default.createElement("div", null,
        react_2.default.createElement(code_editor_1.CodeEditor, { languageId: "loglang", height: 250, value: logs, onChange: addon_actions_1.action('onChange'), hoverProvider: {
                provideHover,
            } })));
}, {
    info: {
        text: 'Hover dialog example can be triggered by hovering over a word',
    },
});
