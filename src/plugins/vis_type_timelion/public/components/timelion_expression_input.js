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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const monaco_1 = require("@kbn/ui-shared-deps/monaco");
const public_1 = require("../../../kibana_react/public");
const timelion_expression_input_helpers_1 = require("./timelion_expression_input_helpers");
const arg_value_suggestions_1 = require("../helpers/arg_value_suggestions");
const LANGUAGE_ID = 'timelion_expression';
monaco_1.monaco.languages.register({ id: LANGUAGE_ID });
function TimelionExpressionInput({ value, setValue }) {
    const functionList = react_1.useRef([]);
    const kibana = public_1.useKibana();
    const argValueSuggestions = react_1.useMemo(arg_value_suggestions_1.getArgValueSuggestions, []);
    const provideCompletionItems = react_1.useCallback(async (model, position) => {
        const text = model.getValue();
        const wordUntil = model.getWordUntilPosition(position);
        const wordRange = new monaco_1.monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
        const suggestions = await timelion_expression_input_helpers_1.suggest(text, functionList.current, 
        // it's important to offset the cursor position on 1 point left
        // because of PEG parser starts the line with 0, but monaco with 1
        position.column - 1, argValueSuggestions);
        return {
            suggestions: suggestions
                ? suggestions.list.map((s) => timelion_expression_input_helpers_1.getSuggestion(s, suggestions.type, wordRange))
                : [],
        };
    }, [argValueSuggestions]);
    const provideHover = react_1.useCallback(async (model, position) => {
        const suggestions = await timelion_expression_input_helpers_1.suggest(model.getValue(), functionList.current, 
        // it's important to offset the cursor position on 1 point left
        // because of PEG parser starts the line with 0, but monaco with 1
        position.column - 1, argValueSuggestions);
        return {
            contents: suggestions
                ? suggestions.list.map((s) => ({
                    value: s.help,
                }))
                : [],
        };
    }, [argValueSuggestions]);
    react_1.useEffect(() => {
        if (kibana.services.http) {
            kibana.services.http.get('../api/timelion/functions').then(data => {
                functionList.current = data;
            });
        }
    }, [kibana.services.http]);
    return (react_1.default.createElement("div", { className: "timExpressionInput" },
        react_1.default.createElement(eui_1.EuiFormLabel, null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "timelion.vis.expressionLabel", defaultMessage: "Timelion expression" })),
        react_1.default.createElement("div", { className: "timExpressionInput__editor" },
            react_1.default.createElement("div", { className: "timExpressionInput__absolute" },
                react_1.default.createElement(public_1.CodeEditor, { languageId: LANGUAGE_ID, value: value, onChange: setValue, suggestionProvider: {
                        triggerCharacters: ['.', ',', '(', '=', ':'],
                        provideCompletionItems,
                    }, hoverProvider: { provideHover }, options: {
                        fixedOverflowWidgets: true,
                        fontSize: 14,
                        folding: false,
                        lineNumbers: 'off',
                        scrollBeyondLastLine: false,
                        minimap: {
                            enabled: false,
                        },
                        wordBasedSuggestions: false,
                        wordWrap: 'on',
                        wrappingIndent: 'indent',
                    }, languageConfiguration: {
                        autoClosingPairs: [
                            {
                                open: '(',
                                close: ')',
                            },
                        ],
                    } })))));
}
exports.TimelionExpressionInput = TimelionExpressionInput;
