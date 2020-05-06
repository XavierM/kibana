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
const i18n_1 = require("@kbn/i18n");
exports.convertSampleInput = (converter, inputs) => {
    let error;
    let samples = [];
    try {
        samples = inputs.map(input => {
            return {
                input,
                output: converter(input),
            };
        });
    }
    catch (e) {
        error = i18n_1.i18n.translate('common.ui.fieldEditor.defaultErrorMessage', {
            defaultMessage: 'An error occurred while trying to use this format configuration: {message}',
            values: { message: e.message },
        });
    }
    return {
        error,
        samples,
    };
};
exports.defaultState = {
    sampleInputs: [],
    sampleConverterType: 'text',
    error: undefined,
    samples: [],
    sampleInputsByType: {},
};
class DefaultFormatEditor extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = exports.defaultState;
        this.onChange = (newParams = {}) => {
            const { onChange, formatParams } = this.props;
            onChange({
                ...formatParams,
                ...newParams,
            });
        };
    }
    static getDerivedStateFromProps(nextProps, state) {
        const { format, formatParams, onError } = nextProps;
        const { sampleInputsByType, sampleInputs, sampleConverterType } = state;
        const converter = format.getConverterFor(sampleConverterType);
        const type = typeof sampleInputsByType === 'object' && formatParams.type;
        const inputs = type ? sampleInputsByType[formatParams.type] || [] : sampleInputs;
        const output = exports.convertSampleInput(converter, inputs);
        onError(output.error);
        return output;
    }
    render() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
}
exports.DefaultFormatEditor = DefaultFormatEditor;
