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
const sample_1 = require("./sample");
class TruncateFormatEditor extends default_1.DefaultFormatEditor {
    constructor() {
        super(...arguments);
        this.state = {
            ...default_1.defaultState,
            sampleInputs: [sample_1.sample],
        };
    }
    render() {
        const { formatParams, onError } = this.props;
        const { error, samples } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.truncate.lengthLabel", defaultMessage: "Field length" }), isInvalid: !!error, error: error },
                react_1.default.createElement(eui_1.EuiFieldNumber, { defaultValue: formatParams.fieldLength, min: 1, onChange: e => {
                        if (e.target.checkValidity()) {
                            this.onChange({
                                fieldLength: e.target.value ? Number(e.target.value) : null,
                            });
                        }
                        else {
                            onError(e.target.validationMessage);
                        }
                    }, isInvalid: !!error })),
            react_1.default.createElement(samples_1.FormatEditorSamples, { samples: samples })));
    }
}
exports.TruncateFormatEditor = TruncateFormatEditor;
TruncateFormatEditor.formatId = 'truncate';
