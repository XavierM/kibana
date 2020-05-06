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
class StringFormatEditor extends default_1.DefaultFormatEditor {
    constructor() {
        super(...arguments);
        this.state = {
            ...default_1.defaultState,
            sampleInputs: [
                'A Quick Brown Fox.',
                'STAY CALM!',
                'com.organizations.project.ClassName',
                'hostname.net',
                'SGVsbG8gd29ybGQ=',
                '%EC%95%88%EB%85%95%20%ED%82%A4%EB%B0%94%EB%82%98',
            ],
        };
    }
    render() {
        const { format, formatParams } = this.props;
        const { error, samples } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.string.transformLabel", defaultMessage: "Transform" }), isInvalid: !!error, error: error },
                react_1.default.createElement(eui_1.EuiSelect, { "data-test-subj": "stringEditorTransform", defaultValue: formatParams.transform, options: format.type.transformOptions.map((option) => {
                        return {
                            value: option.kind,
                            text: option.text,
                        };
                    }), onChange: e => {
                        this.onChange({ transform: e.target.value });
                    }, isInvalid: !!error })),
            react_1.default.createElement(samples_1.FormatEditorSamples, { samples: samples })));
    }
}
exports.StringFormatEditor = StringFormatEditor;
StringFormatEditor.formatId = 'string';
