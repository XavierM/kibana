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
const range_control_editor_1 = require("./range_control_editor");
const list_control_editor_1 = require("./list_control_editor");
const editor_utils_1 = require("../../editor_utils");
class ControlEditorUi extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.changeLabel = (event) => {
            this.props.handleLabelChange(this.props.controlIndex, event.target.value);
        };
        this.removeControl = () => {
            this.props.handleRemoveControl(this.props.controlIndex);
        };
        this.moveUpControl = () => {
            this.props.moveControl(this.props.controlIndex, -1);
        };
        this.moveDownControl = () => {
            this.props.moveControl(this.props.controlIndex, 1);
        };
        this.changeIndexPattern = (indexPatternId) => {
            this.props.handleIndexPatternChange(this.props.controlIndex, indexPatternId);
        };
        this.changeFieldName = (fieldName) => {
            this.props.handleFieldNameChange(this.props.controlIndex, fieldName);
        };
    }
    renderEditor() {
        let controlEditor = null;
        switch (this.props.controlParams.type) {
            case editor_utils_1.CONTROL_TYPES.LIST:
                controlEditor = (react_1.default.createElement(list_control_editor_1.ListControlEditor, { controlIndex: this.props.controlIndex, controlParams: this.props.controlParams, handleIndexPatternChange: this.changeIndexPattern, handleFieldNameChange: this.changeFieldName, getIndexPattern: this.props.getIndexPattern, handleOptionsChange: this.props.handleOptionsChange, parentCandidates: this.props.parentCandidates, handleParentChange: this.props.handleParentChange, deps: this.props.deps }));
                break;
            case editor_utils_1.CONTROL_TYPES.RANGE:
                controlEditor = (react_1.default.createElement(range_control_editor_1.RangeControlEditor, { controlIndex: this.props.controlIndex, controlParams: this.props.controlParams, handleIndexPatternChange: this.changeIndexPattern, handleFieldNameChange: this.changeFieldName, getIndexPattern: this.props.getIndexPattern, handleOptionsChange: this.props.handleOptionsChange, deps: this.props.deps }));
                break;
            default:
                throw new Error(`Unhandled control editor type ${this.props.controlParams.type}`);
        }
        const labelId = `controlLabel${this.props.controlIndex}`;
        return (react_1.default.createElement(eui_1.EuiForm, null,
            react_1.default.createElement(eui_1.EuiFormRow, { id: labelId, label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.controlEditor.controlLabel", defaultMessage: "Control Label" }) },
                react_1.default.createElement(eui_1.EuiFieldText, { value: this.props.controlParams.label, onChange: this.changeLabel })),
            controlEditor));
    }
    renderEditorButtons() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": this.props.intl.formatMessage({
                    id: 'inputControl.editor.controlEditor.moveControlUpAriaLabel',
                    defaultMessage: 'Move control up',
                }), color: "primary", onClick: this.moveUpControl, iconType: "sortUp", "data-test-subj": `inputControlEditorMoveUpControl${this.props.controlIndex}` }),
            react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": this.props.intl.formatMessage({
                    id: 'inputControl.editor.controlEditor.moveControlDownAriaLabel',
                    defaultMessage: 'Move control down',
                }), color: "primary", onClick: this.moveDownControl, iconType: "sortDown", "data-test-subj": `inputControlEditorMoveDownControl${this.props.controlIndex}` }),
            react_1.default.createElement(eui_1.EuiButtonIcon, { "aria-label": this.props.intl.formatMessage({
                    id: 'inputControl.editor.controlEditor.removeControlAriaLabel',
                    defaultMessage: 'Remove control',
                }), color: "danger", onClick: this.removeControl, iconType: "cross", "data-test-subj": `inputControlEditorRemoveControl${this.props.controlIndex}` })));
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiPanel, { grow: false, className: "icvControlEditor__panel" },
            react_1.default.createElement(eui_1.EuiAccordion, { id: "controlEditorAccordion", buttonContent: editor_utils_1.getTitle(this.props.controlParams, this.props.controlIndex), extraAction: this.renderEditorButtons(), initialIsOpen: true },
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                this.renderEditor())));
    }
}
exports.ControlEditor = react_2.injectI18n(ControlEditorUi);
