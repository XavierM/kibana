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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
exports.UrlTemplateFlyout = ({ isVisible = false, onClose = () => { } }) => {
    return isVisible ? (react_1.default.createElement(eui_1.EuiFlyout, { onClose: onClose },
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplateHeader", defaultMessage: "Url Template" })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplateLabel.fieldDetail", defaultMessage: "If a field only contains part of a URL then a {strongUrlTemplate} can be used to format the value as\n              a complete URL. The format is a string which uses double curly brace notation {doubleCurlyBraces} to inject values.\n              The following values can be accessed:", values: {
                            doubleCurlyBraces: react_1.default.createElement(eui_1.EuiCode, null, '{{ }}'),
                            strongUrlTemplate: (react_1.default.createElement("strong", null,
                                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplateLabel.strongUrlTemplateLabel", defaultMessage: "Url Template" }))),
                        } })),
                react_1.default.createElement("ul", null,
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(eui_1.EuiCode, null, "value"),
                        " \u2014\u00A0",
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplate.valueLabel", defaultMessage: "The URI-escaped value" })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(eui_1.EuiCode, null, "rawValue"),
                        " \u2014\u00A0",
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplate.rawValueLabel", defaultMessage: "The unescaped value" }))),
                react_1.default.createElement("h4", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.urlTemplate.examplesHeader", defaultMessage: "Examples" })),
                react_1.default.createElement(eui_1.EuiBasicTable, { items: [
                        {
                            input: 1234,
                            template: 'http://company.net/profiles?user_id={{value}}',
                            output: 'http://company.net/profiles?user_id=1234',
                        },
                        {
                            input: 'users/admin',
                            template: 'http://company.net/groups?id={{value}}',
                            output: 'http://company.net/groups?id=users%2Fadmin',
                        },
                        {
                            input: '/images/favicon.ico',
                            template: 'http://www.site.com{{rawValue}}',
                            output: 'http://www.site.com/images/favicon.ico',
                        },
                    ], columns: [
                        {
                            field: 'input',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.urlTemplate.inputHeader', {
                                defaultMessage: 'Input',
                            }),
                            width: '160px',
                        },
                        {
                            field: 'template',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.urlTemplate.templateHeader', {
                                defaultMessage: 'Template',
                            }),
                        },
                        {
                            field: 'output',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.urlTemplate.outputHeader', {
                                defaultMessage: 'Output',
                            }),
                        },
                    ] }))))) : null;
};
