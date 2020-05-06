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
const i18n_1 = require("@kbn/i18n");
const default_1 = require("../default");
const samples_1 = require("../../samples");
class DurationFormatEditor extends default_1.DefaultFormatEditor {
    constructor() {
        super(...arguments);
        this.state = {
            ...default_1.defaultState,
            sampleInputs: [-123, 1, 12, 123, 658, 1988, 3857, 123292, 923528271],
            hasDecimalError: false,
        };
    }
    static getDerivedStateFromProps(nextProps, state) {
        const output = super.getDerivedStateFromProps(nextProps, state);
        let error = null;
        if (!nextProps.format.isHuman() &&
            nextProps.formatParams.outputPrecision > 20) {
            error = i18n_1.i18n.translate('common.ui.fieldEditor.durationErrorMessage', {
                defaultMessage: 'Decimal places must be between 0 and 20',
            });
            nextProps.onError(error);
            return {
                ...output,
                error,
                hasDecimalError: true,
            };
        }
        return {
            ...output,
            hasDecimalError: false,
        };
    }
    render() {
        const { format, formatParams } = this.props;
        const { error, samples, hasDecimalError } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.duration.inputFormatLabel", defaultMessage: "Input format" }), isInvalid: !!error, error: hasDecimalError ? null : error },
                react_1.default.createElement(eui_1.EuiSelect, { value: formatParams.inputFormat, options: format.type.inputFormats.map((fmt) => {
                        return {
                            value: fmt.kind,
                            text: fmt.text,
                        };
                    }), onChange: e => {
                        this.onChange({ inputFormat: e.target.value });
                    }, isInvalid: !!error })),
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.duration.outputFormatLabel", defaultMessage: "Output format" }), isInvalid: !!error },
                react_1.default.createElement(eui_1.EuiSelect, { value: formatParams.outputFormat, options: format.type.outputFormats.map((fmt) => {
                        return {
                            value: fmt.method,
                            text: fmt.text,
                        };
                    }), onChange: e => {
                        this.onChange({ outputFormat: e.target.value });
                    }, isInvalid: !!error })),
            !format.isHuman() ? (react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.duration.decimalPlacesLabel", defaultMessage: "Decimal places" }), isInvalid: !!error, error: hasDecimalError ? error : null },
                react_1.default.createElement(eui_1.EuiFieldNumber, { value: formatParams.outputPrecision, min: 0, max: 20, onChange: e => {
                        this.onChange({ outputPrecision: e.target.value ? Number(e.target.value) : null });
                    }, isInvalid: !!error }))) : null,
            react_1.default.createElement(samples_1.FormatEditorSamples, { samples: samples })));
    }
}
exports.DurationFormatEditor = DurationFormatEditor;
DurationFormatEditor.formatId = 'duration';
