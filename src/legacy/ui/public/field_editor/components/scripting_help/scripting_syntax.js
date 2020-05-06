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
exports.ScriptingSyntax = ({ docLinksScriptedFields }) => (react_1.default.createElement(react_1.Fragment, null,
    react_1.default.createElement(eui_1.EuiSpacer, null),
    react_1.default.createElement(eui_1.EuiText, null,
        react_1.default.createElement("h3", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntaxHeader", defaultMessage: "Syntax" })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.defaultLabel.defaultDetail", defaultMessage: "By default, Kibana scripted fields use {painless}, a simple and secure scripting language designed\n          specifically for use with Elasticsearch, to access values in the document use the following format:", values: {
                    painless: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.painless },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.defaultLabel.painlessLink", defaultMessage: "Painless" }),
                        ' ',
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                } })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(eui_1.EuiCode, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.default.formatLabel", defaultMessage: "doc['some_field'].value" }))),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.painlessLabel.painlessDetail", defaultMessage: "Painless is powerful but easy to use. It provides access to many {javaAPIs}. Read up on its {syntax} and\n          you'll be up to speed in no time!", values: {
                    javaAPIs: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.painlessApi },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.painlessLabel.javaAPIsLink", defaultMessage: "native Java APIs" }),
                        "\u00A0",
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                    syntax: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.painlessSyntax },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.painlessLabel.syntaxLink", defaultMessage: "syntax" }),
                        "\u00A0",
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                } })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.kibanaLabel", defaultMessage: "Kibana currently imposes one special limitation on the painless scripts you write. They cannot contain named\n          functions." })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.commonLabel.commonDetail", defaultMessage: "Coming from an older version of Kibana? The {lucene} you know and love are still available. Lucene expressions\n          are a lot like JavaScript, but limited to basic arithmetic, bitwise and comparison operations.", values: {
                    lucene: (react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: docLinksScriptedFields.luceneExpressions },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.commonLabel.luceneLink", defaultMessage: "Lucene Expressions" }),
                        "\u00A0",
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))),
                } })),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.limitsLabel", defaultMessage: "There are a few limitations when using Lucene Expressions:" })),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.limits.typesLabel", defaultMessage: "Only numeric, boolean, date, and geo_point fields may be accessed" })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.limits.fieldsLabel", defaultMessage: "Stored fields are not available" })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.limits.sparseLabel", defaultMessage: "If a field is sparse (only some documents contain a value), documents missing the field will have\n            a value of 0" }))),
        react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operationsLabel", defaultMessage: "Here are all the operations available to lucene expressions:" })),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.arithmeticLabel", defaultMessage: "Arithmetic operators: {operators}", values: { operators: react_1.default.createElement("code", null, "+ - * / %") } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.bitwiseLabel", defaultMessage: "Bitwise operators: {operators}", values: {
                        operators: react_1.default.createElement("code", null, "| & ^ ~ << >> >>>"),
                    } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.booleanLabel", defaultMessage: "Boolean operators (including the ternary operator): {operators}", values: { operators: react_1.default.createElement("code", null, "&& || ! ?:") } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.comparisonLabel", defaultMessage: "Comparison operators: {operators}", values: { operators: react_1.default.createElement("code", null, "< <= == >= >") } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.mathLabel", defaultMessage: "Common mathematic functions: {operators}", values: { operators: react_1.default.createElement("code", null, "abs ceil exp floor ln log10 logn max min sqrt pow") } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.trigLabel", defaultMessage: "Trigonometric library functions: {operators}", values: {
                        operators: (react_1.default.createElement("code", null, "acosh acos asinh asin atanh atan atan2 cosh cos sinh sin tanh tan")),
                    } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.distanceLabel", defaultMessage: "Distance functions: {operators}", values: { operators: react_1.default.createElement("code", null, "haversin") } })),
            react_1.default.createElement("li", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.syntax.lucene.operations.miscellaneousLabel", defaultMessage: "Miscellaneous functions: {operators}", values: { operators: react_1.default.createElement("code", null, "min, max") } }))))));
