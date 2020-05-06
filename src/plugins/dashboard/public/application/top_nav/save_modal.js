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
const public_1 = require("../../../../saved_objects/public");
class DashboardSaveModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: this.props.description,
            timeRestore: this.props.timeRestore,
        };
        this.saveDashboard = ({ newTitle, newCopyOnSave, isTitleDuplicateConfirmed, onTitleDuplicate, }) => {
            this.props.onSave({
                newTitle,
                newDescription: this.state.description,
                newCopyOnSave,
                newTimeRestore: this.state.timeRestore,
                isTitleDuplicateConfirmed,
                onTitleDuplicate,
            });
        };
        this.onDescriptionChange = (event) => {
            this.setState({
                description: event.target.value,
            });
        };
        this.onTimeRestoreChange = (event) => {
            this.setState({
                timeRestore: event.target.checked,
            });
        };
    }
    renderDashboardSaveOptions() {
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.saveModal.descriptionFormRowLabel", defaultMessage: "Description" }) },
                react_1.default.createElement(eui_1.EuiTextArea, { "data-test-subj": "dashboardDescription", value: this.state.description, onChange: this.onDescriptionChange })),
            react_1.default.createElement(eui_1.EuiFormRow, { helpText: react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.saveModal.storeTimeWithDashboardFormRowHelpText", defaultMessage: "This changes the time filter to the currently selected time each time this dashboard is loaded." }) },
                react_1.default.createElement(eui_1.EuiSwitch, { "data-test-subj": "storeTimeWithDashboard", checked: this.state.timeRestore, onChange: this.onTimeRestoreChange, label: react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.saveModal.storeTimeWithDashboardFormRowLabel", defaultMessage: "Store time with dashboard" }) }))));
    }
    render() {
        return (react_1.default.createElement(public_1.SavedObjectSaveModal, { onSave: this.saveDashboard, onClose: this.props.onClose, title: this.props.title, showCopyOnSave: this.props.showCopyOnSave, objectType: "dashboard", options: this.renderDashboardSaveOptions(), showDescription: false }));
    }
}
exports.DashboardSaveModal = DashboardSaveModal;
