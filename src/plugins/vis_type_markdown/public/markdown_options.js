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
function MarkdownOptions({ stateParams, setValue }) {
    const onMarkdownUpdate = react_1.useCallback((value) => setValue('markdown', value), [setValue]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiFlexGroup, { direction: "column", gutterSize: "m", className: "mkdEditor" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none", justifyContent: "spaceBetween", alignItems: "baseline" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                            react_1.default.createElement("h2", null,
                                react_1.default.createElement("label", { htmlFor: "markdownVisInput" }, "Markdown")))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                            react_1.default.createElement(eui_1.EuiLink, { href: "https://help.github.com/articles/github-flavored-markdown/", target: "_blank" },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeMarkdown.params.helpLinkLabel", defaultMessage: "Help" }),
                                ' ',
                                react_1.default.createElement(eui_1.EuiIcon, { type: "popout", size: "s" })))))),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiTextArea, { id: "markdownVisInput", className: "visEditor--markdown__textarea", value: stateParams.markdown, onChange: ({ target: { value } }) => onMarkdownUpdate(value), fullWidth: true, "data-test-subj": "markdownTextarea", resize: "none" })))));
}
exports.MarkdownOptions = MarkdownOptions;
