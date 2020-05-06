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
const default_1 = require("../default");
const samples_1 = require("../../samples");
class NumberFormatEditor extends default_1.DefaultFormatEditor {
    constructor() {
        super(...arguments);
        this.state = {
            ...default_1.defaultState,
            sampleInputs: [10000, 12.345678, -1, -999, 0.52],
        };
    }
    render() {
        const { format, formatParams } = this.props;
        const { error, samples } = this.state;
        const defaultPattern = format.getParamDefaults().pattern;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.number.numeralLabel", defaultMessage: "Numeral.js format pattern (Default: {defaultPattern})", values: { defaultPattern: react_1.default.createElement(eui_1.EuiCode, null, defaultPattern) } }), helpText: react_1.default.createElement("span", null,
                    react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: "https://adamwdraper.github.io/Numeral-js/" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.number.documentationLabel", defaultMessage: "Documentation" }),
                        "\u00A0",
                        react_1.default.createElement(eui_1.EuiIcon, { type: "link" }))), isInvalid: !!error, error: error },
                react_1.default.createElement(eui_1.EuiFieldText, { value: formatParams.pattern, placeholder: defaultPattern, onChange: e => {
                        this.onChange({ pattern: e.target.value });
                    }, isInvalid: !!error })),
            react_1.default.createElement(samples_1.FormatEditorSamples, { samples: samples })));
    }
}
exports.NumberFormatEditor = NumberFormatEditor;
NumberFormatEditor.formatId = 'number';
