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
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const field_1 = require("./field");
const lib_1 = require("../../../lib");
class Form extends react_1.Component {
    constructor(props) {
        super(props);
        this.handleFieldChange = (name, newState) => {
            this.setState({
                fieldStates: {
                    ...this.state.fieldStates,
                    [name]: newState,
                },
            });
        };
        this.onCancel = () => {
            window.history.back();
        };
        this.onSubmit = async () => {
            const { object, onSave } = this.props;
            const { fields, fieldStates } = this.state;
            if (!this.isFormValid()) {
                return;
            }
            this.setState({
                submitting: true,
            });
            const source = lodash_1.cloneDeep(object.attributes);
            fields.forEach(field => {
                let value = fieldStates[field.name]?.value ?? field.value;
                if (field.type === 'array' && typeof value === 'string') {
                    value = JSON.parse(value);
                }
                lodash_1.set(source, field.name, value);
            });
            const { references, ...attributes } = source;
            await onSave({ attributes, references });
            this.setState({
                submitting: false,
            });
        };
        this.state = {
            fields: [],
            fieldStates: {},
            submitting: false,
        };
    }
    componentDidMount() {
        const { object, service } = this.props;
        const fields = lib_1.createFieldList(object, service);
        this.setState({
            fields,
        });
    }
    render() {
        const { editionEnabled, service } = this.props;
        const { fields, fieldStates, submitting } = this.state;
        const isValid = this.isFormValid();
        return (react_1.default.createElement(eui_1.EuiForm, { "data-test-subj": "savedObjectEditForm", role: "form" },
            fields.map(field => (react_1.default.createElement(field_1.Field, { key: `${field.type}-${field.name}`, type: field.type, name: field.name, value: field.value, state: fieldStates[field.name], disabled: !editionEnabled, onChange: this.handleFieldChange }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: 'l' }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false, gutterSize: 'm' },
                editionEnabled && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButton, { fill: true, "aria-label": i18n_1.i18n.translate('savedObjectsManagement.view.saveButtonAriaLabel', {
                            defaultMessage: 'Save { title } object',
                            values: {
                                title: service.type,
                            },
                        }), onClick: this.onSubmit, disabled: !isValid || submitting, "data-test-subj": "savedObjectEditSave" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.saveButtonLabel", defaultMessage: "Save { title } object", values: { title: service.type } })))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { "aria-label": i18n_1.i18n.translate('savedObjectsManagement.view.cancelButtonAriaLabel', {
                            defaultMessage: 'Cancel',
                        }), onClick: this.onCancel, "data-test-subj": "savedObjectEditCancel" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.cancelButtonLabel", defaultMessage: "Cancel" }))))));
    }
    isFormValid() {
        const { fieldStates } = this.state;
        return !Object.values(fieldStates).some(state => state.invalid === true);
    }
}
exports.Form = Form;
