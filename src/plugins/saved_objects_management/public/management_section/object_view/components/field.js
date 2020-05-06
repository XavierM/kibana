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
class Field extends react_1.PureComponent {
    render() {
        const { name } = this.props;
        return (react_1.default.createElement(eui_1.EuiFormRow, { fullWidth: true, label: name }, this.renderField()));
    }
    onCodeEditorChange(targetValue) {
        const { name, onChange } = this.props;
        let invalid = false;
        try {
            JSON.parse(targetValue);
        }
        catch (e) {
            invalid = true;
        }
        onChange(name, {
            value: targetValue,
            invalid,
        });
    }
    onFieldChange(targetValue) {
        const { name, type, onChange } = this.props;
        let newParsedValue = targetValue;
        let invalid = false;
        if (type === 'number') {
            try {
                newParsedValue = Number(newParsedValue);
            }
            catch (e) {
                invalid = true;
            }
        }
        onChange(name, {
            value: newParsedValue,
            invalid,
        });
    }
    renderField() {
        const { type, name, state, disabled } = this.props;
        const currentValue = state?.value ?? this.props.value;
        switch (type) {
            case 'number':
                return (react_1.default.createElement(eui_1.EuiFieldNumber, { name: name, id: this.fieldId, value: currentValue, onChange: e => this.onFieldChange(e.target.value), disabled: disabled, "data-test-subj": `savedObjects-editField-${name}` }));
            case 'boolean':
                return (react_1.default.createElement(eui_1.EuiSwitch, { name: name, id: this.fieldId, label: !!currentValue ? (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.field.onLabel", defaultMessage: "On" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.field.offLabel", defaultMessage: "Off" })), checked: !!currentValue, onChange: e => this.onFieldChange(e.target.checked), disabled: disabled, "data-test-subj": `savedObjects-editField-${name}` }));
            case 'json':
            case 'array':
                return (react_1.default.createElement("div", { "data-test-subj": `savedObjects-editField-${name}` },
                    react_1.default.createElement(eui_1.EuiCodeEditor, { mode: "json", theme: "textmate", value: currentValue, onChange: (value) => this.onCodeEditorChange(value), width: "100%", height: "auto", minLines: 6, maxLines: 30, isReadOnly: disabled, setOptions: {
                            showLineNumbers: true,
                            tabSize: 2,
                            useSoftTabs: true,
                        }, editorProps: {
                            $blockScrolling: Infinity,
                        }, showGutter: true })));
            default:
                return (react_1.default.createElement(eui_1.EuiFieldText, { id: this.fieldId, name: name, value: currentValue, onChange: e => this.onFieldChange(e.target.value), disabled: disabled, "data-test-subj": `savedObjects-editField-${name}` }));
        }
    }
    get fieldId() {
        const { name } = this.props;
        return `savedObjects-editField-${name}`;
    }
}
exports.Field = Field;
