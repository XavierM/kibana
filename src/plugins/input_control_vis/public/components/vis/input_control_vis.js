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
const editor_utils_1 = require("../../editor_utils");
const list_control_1 = require("./list_control");
const range_control_1 = require("./range_control");
function isListControl(control) {
    return control.type === editor_utils_1.CONTROL_TYPES.LIST;
}
function isRangeControl(control) {
    return control.type === editor_utils_1.CONTROL_TYPES.RANGE;
}
class InputControlVis extends react_1.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleClearAll = this.handleClearAll.bind(this);
    }
    handleSubmit() {
        this.props.submitFilters();
    }
    handleReset() {
        this.props.resetControls();
    }
    handleClearAll() {
        this.props.clearControls();
    }
    renderControls() {
        return this.props.controls.map((control, index) => {
            let controlComponent = null;
            if (isListControl(control)) {
                controlComponent = (react_1.default.createElement(list_control_1.ListControl, { id: control.id, label: control.label, options: control.selectOptions, selectedOptions: control.value, formatOptionLabel: control.format, disableMsg: control.isEnabled() ? undefined : control.disabledReason, multiselect: control.options.multiselect, partialResults: control.partialResults, dynamicOptions: control.options.dynamicOptions, controlIndex: index, stageFilter: this.props.stageFilter, fetchOptions: query => {
                        this.props.refreshControl(index, query);
                    } }));
            }
            else if (isRangeControl(control)) {
                controlComponent = (react_1.default.createElement(range_control_1.RangeControl, { control: control, controlIndex: index, stageFilter: this.props.stageFilter }));
            }
            else {
                throw new Error(`Unhandled control type ${control.type}`);
            }
            return (react_1.default.createElement(eui_1.EuiFlexItem, { key: control.id, style: { minWidth: '250px' }, "data-test-subj": "inputControlItem" }, controlComponent));
        });
    }
    renderStagingButtons() {
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: this.handleSubmit, disabled: !this.props.hasChanges(), "data-test-subj": "inputControlSubmitBtn" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.vis.inputControlVis.applyChangesButtonLabel", defaultMessage: "Apply changes" }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.handleReset, disabled: !this.props.hasChanges(), "data-test-subj": "inputControlCancelBtn" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.vis.inputControlVis.cancelChangesButtonLabel", defaultMessage: "Cancel changes" }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.handleClearAll, disabled: !this.props.hasValues(), "data-test-subj": "inputControlClearBtn" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.vis.inputControlVis.clearFormButtonLabel", defaultMessage: "Clear form" })))));
    }
    render() {
        let stagingButtons;
        if (this.props.controls.length > 0 && !this.props.updateFiltersOnChange) {
            stagingButtons = this.renderStagingButtons();
        }
        return (react_1.default.createElement("div", { className: "icvContainer" },
            react_1.default.createElement(eui_1.EuiFlexGroup, { wrap: true }, this.renderControls()),
            stagingButtons));
    }
}
exports.InputControlVis = InputControlVis;
