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
class OptionsTab extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.handleUpdateFiltersChange = (event) => {
            this.props.setValue('updateFiltersOnChange', event.target.checked);
        };
        this.handleUseTimeFilter = (event) => {
            this.props.setValue('useTimeFilter', event.target.checked);
        };
        this.handlePinFilters = (event) => {
            this.props.setValue('pinFilters', event.target.checked);
        };
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiForm, null,
            react_1.default.createElement(eui_1.EuiFormRow, { id: "updateFiltersOnChange" },
                react_1.default.createElement(eui_1.EuiSwitch, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.optionsTab.updateFilterLabel", defaultMessage: "Update Kibana filters on each change" }), checked: this.props.stateParams.updateFiltersOnChange, onChange: this.handleUpdateFiltersChange, "data-test-subj": "inputControlEditorUpdateFiltersOnChangeCheckbox" })),
            react_1.default.createElement(eui_1.EuiFormRow, { id: "useTimeFilter" },
                react_1.default.createElement(eui_1.EuiSwitch, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.optionsTab.useTimeFilterLabel", defaultMessage: "Use time filter" }), checked: this.props.stateParams.useTimeFilter, onChange: this.handleUseTimeFilter, "data-test-subj": "inputControlEditorUseTimeFilterCheckbox" })),
            react_1.default.createElement(eui_1.EuiFormRow, { id: "pinFilters" },
                react_1.default.createElement(eui_1.EuiSwitch, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.optionsTab.pinFiltersLabel", defaultMessage: "Pin filters for all applications" }), checked: this.props.stateParams.pinFilters, onChange: this.handlePinFilters, "data-test-subj": "inputControlEditorPinFiltersCheckbox" }))));
    }
}
exports.OptionsTab = OptionsTab;
