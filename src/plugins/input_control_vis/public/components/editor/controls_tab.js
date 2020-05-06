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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const control_editor_1 = require("./control_editor");
const editor_utils_1 = require("../../editor_utils");
const lineage_1 = require("../../lineage");
class ControlsTabUi extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            type: editor_utils_1.CONTROL_TYPES.LIST,
        };
        this.getIndexPattern = async (indexPatternId) => {
            const [, startDeps] = await this.props.deps.core.getStartServices();
            return await startDeps.data.indexPatterns.get(indexPatternId);
        };
        this.onChange = (value) => this.props.setValue('controls', value);
        this.handleLabelChange = (controlIndex, label) => {
            const updatedControl = {
                ...this.props.stateParams.controls[controlIndex],
                label,
            };
            this.onChange(editor_utils_1.setControl(this.props.stateParams.controls, controlIndex, updatedControl));
        };
        this.handleIndexPatternChange = (controlIndex, indexPattern) => {
            const updatedControl = {
                ...this.props.stateParams.controls[controlIndex],
                indexPattern,
                fieldName: '',
            };
            this.onChange(editor_utils_1.setControl(this.props.stateParams.controls, controlIndex, updatedControl));
        };
        this.handleFieldNameChange = (controlIndex, fieldName) => {
            const updatedControl = {
                ...this.props.stateParams.controls[controlIndex],
                fieldName,
            };
            this.onChange(editor_utils_1.setControl(this.props.stateParams.controls, controlIndex, updatedControl));
        };
        this.handleOptionsChange = (controlIndex, optionName, value) => {
            const control = this.props.stateParams.controls[controlIndex];
            const updatedControl = {
                ...control,
                options: {
                    ...control.options,
                    [optionName]: value,
                },
            };
            this.onChange(editor_utils_1.setControl(this.props.stateParams.controls, controlIndex, updatedControl));
        };
        this.handleRemoveControl = (controlIndex) => {
            this.onChange(editor_utils_1.removeControl(this.props.stateParams.controls, controlIndex));
        };
        this.moveControl = (controlIndex, direction) => {
            this.onChange(editor_utils_1.moveControl(this.props.stateParams.controls, controlIndex, direction));
        };
        this.handleAddControl = () => {
            this.onChange(editor_utils_1.addControl(this.props.stateParams.controls, editor_utils_1.newControl(this.state.type)));
        };
        this.handleParentChange = (controlIndex, parent) => {
            const updatedControl = {
                ...this.props.stateParams.controls[controlIndex],
                parent,
            };
            this.onChange(editor_utils_1.setControl(this.props.stateParams.controls, controlIndex, updatedControl));
        };
    }
    renderControls() {
        const lineageMap = lineage_1.getLineageMap(this.props.stateParams.controls);
        return this.props.stateParams.controls.map((controlParams, controlIndex) => {
            const parentCandidates = lineage_1.getParentCandidates(this.props.stateParams.controls, controlParams.id, lineageMap);
            return (react_1.default.createElement(control_editor_1.ControlEditor, { key: controlParams.id, controlIndex: controlIndex, controlParams: controlParams, handleLabelChange: this.handleLabelChange, moveControl: this.moveControl, handleRemoveControl: this.handleRemoveControl, handleIndexPatternChange: this.handleIndexPatternChange, handleFieldNameChange: this.handleFieldNameChange, getIndexPattern: this.getIndexPattern, handleOptionsChange: this.handleOptionsChange, parentCandidates: parentCandidates, handleParentChange: this.handleParentChange, deps: this.props.deps }));
        });
    }
    render() {
        const { intl } = this.props;
        return (react_1.default.createElement("div", null,
            this.renderControls(),
            react_1.default.createElement(eui_1.EuiPanel, { grow: false },
                react_1.default.createElement(eui_1.EuiFlexGroup, null,
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(eui_1.EuiFormRow, { id: "selectControlType" },
                            react_1.default.createElement(eui_1.EuiSelect, { "data-test-subj": "selectControlType", options: [
                                    {
                                        value: editor_utils_1.CONTROL_TYPES.RANGE,
                                        text: intl.formatMessage({
                                            id: 'inputControl.editor.controlsTab.select.rangeDropDownOptionLabel',
                                            defaultMessage: 'Range slider',
                                        }),
                                    },
                                    {
                                        value: editor_utils_1.CONTROL_TYPES.LIST,
                                        text: intl.formatMessage({
                                            id: 'inputControl.editor.controlsTab.select.listDropDownOptionLabel',
                                            defaultMessage: 'Options list',
                                        }),
                                    },
                                ], value: this.state.type, onChange: event => this.setState({ type: event.target.value }), "aria-label": intl.formatMessage({
                                    id: 'inputControl.editor.controlsTab.select.controlTypeAriaLabel',
                                    defaultMessage: 'Select control type',
                                }) }))),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiFormRow, { id: "addControl" },
                            react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: this.handleAddControl, iconType: "plusInCircle", "data-test-subj": "inputControlEditorAddBtn", "aria-label": intl.formatMessage({
                                    id: 'inputControl.editor.controlsTab.select.addControlAriaLabel',
                                    defaultMessage: 'Add control',
                                }) },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.controlsTab.addButtonLabel", defaultMessage: "Add" }))))))));
    }
}
exports.ControlsTab = react_2.injectI18n(ControlsTabUi);
exports.getControlsTab = (deps) => (props) => react_1.default.createElement(exports.ControlsTab, Object.assign({}, props, { deps: deps }));
