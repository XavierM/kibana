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
const items = [
    {
        input: 1234,
        urlTemplate: 'http://company.net/profiles?user_id={{value}}',
        labelTemplate: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.example.idLabel', {
            defaultMessage: 'User #{value}',
            values: { value: '{{value}}' },
        }),
        output: '<a href="http://company.net/profiles?user_id=1234">' +
            i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.example.output.idLabel', {
                defaultMessage: 'User',
            }) +
            ' #1234</a>',
    },
    {
        input: '/assets/main.css',
        urlTemplate: 'http://site.com{{rawValue}}',
        labelTemplate: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.example.pathLabel', {
            defaultMessage: 'View Asset',
        }),
        output: '<a href="http://site.com/assets/main.css">' +
            i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.example.output.pathLabel', {
                defaultMessage: 'View Asset',
            }) +
            '</a>',
    },
];
exports.LabelTemplateFlyout = ({ isVisible = false, onClose = () => { } }) => {
    return isVisible ? (react_1.default.createElement(eui_1.EuiFlyout, { onClose: onClose },
        react_1.default.createElement(eui_1.EuiFlyoutBody, null,
            react_1.default.createElement(eui_1.EuiText, null,
                react_1.default.createElement("h3", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.labelTemplateHeader", defaultMessage: "Label Template" })),
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.labelTemplateLabel", defaultMessage: "If the URL in this field is large, it might be useful to provide an alternate template for the text version\n              of the URL. This will be displayed instead of the url, but will still link to the URL. The format is a string which uses\n              double curly brace notation {doubleCurlyBraces} to inject values. The following values can be accessed:", values: { doubleCurlyBraces: react_1.default.createElement(eui_1.EuiCode, null, '{{ }}') } })),
                react_1.default.createElement("ul", null,
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(eui_1.EuiCode, null, "value"),
                        " \u2014\u00A0",
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.labelTemplate.valueLabel", defaultMessage: "The fields value" })),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement(eui_1.EuiCode, null, "url"),
                        " \u2014\u00A0",
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.labelTemplate.urlLabel", defaultMessage: "The formatted URL" }))),
                react_1.default.createElement("h4", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.labelTemplate.examplesHeader", defaultMessage: "Examples" })),
                react_1.default.createElement(eui_1.EuiBasicTable, { items: items, columns: [
                        {
                            field: 'input',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.inputHeader', {
                                defaultMessage: 'Input',
                            }),
                            width: '160px',
                        },
                        {
                            field: 'urlTemplate',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.urlHeader', {
                                defaultMessage: 'URL Template',
                            }),
                        },
                        {
                            field: 'labelTemplate',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.labelHeader', {
                                defaultMessage: 'Label Template',
                            }),
                        },
                        {
                            field: 'output',
                            name: i18n_1.i18n.translate('common.ui.fieldEditor.labelTemplate.outputHeader', {
                                defaultMessage: 'Output',
                            }),
                            render: (value) => {
                                return (react_1.default.createElement("span", { 
                                    /*
                                     * Justification for dangerouslySetInnerHTML:
                                     * Example output produces anchor link.
                                     */
                                    dangerouslySetInnerHTML: { __html: value } }));
                            },
                        },
                    ] }))))) : null;
};
exports.LabelTemplateFlyout.displayName = 'LabelTemplateFlyout';
