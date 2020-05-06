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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
class DashboardCloneModal extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.isMounted = false;
        this.onTitleDuplicate = () => {
            this.setState({
                isTitleDuplicateConfirmed: true,
                hasTitleDuplicate: true,
            });
        };
        this.cloneDashboard = async () => {
            this.setState({
                isLoading: true,
            });
            await this.props.onClone(this.state.newDashboardName, this.state.isTitleDuplicateConfirmed, this.onTitleDuplicate);
            if (this.isMounted) {
                this.setState({
                    isLoading: false,
                });
            }
        };
        this.onInputChange = (event) => {
            this.setState({
                newDashboardName: event.target.value,
                isTitleDuplicateConfirmed: false,
                hasTitleDuplicate: false,
            });
        };
        this.renderDuplicateTitleCallout = () => {
            if (!this.state.hasTitleDuplicate) {
                return;
            }
            return (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, null),
                react_1.default.createElement(eui_1.EuiCallOut, { size: "s", title: i18n_1.i18n.translate('dashboard.topNav.cloneModal.dashboardExistsTitle', {
                        defaultMessage: 'A dashboard with the title {newDashboardName} already exists.',
                        values: {
                            newDashboardName: `'${this.state.newDashboardName}'`,
                        },
                    }), color: "warning", "data-test-subj": "titleDupicateWarnMsg" },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.dashboardExistsDescription", defaultMessage: "Click {confirmClone} to clone the dashboard with the duplicate title.", values: {
                                confirmClone: (react_1.default.createElement("strong", null,
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.confirmCloneDescription", defaultMessage: "Confirm Clone" }))),
                            } })))));
        };
        this.state = {
            newDashboardName: props.title,
            isTitleDuplicateConfirmed: false,
            hasTitleDuplicate: false,
            isLoading: false,
        };
    }
    componentDidMount() {
        this.isMounted = true;
    }
    componentWillUnmount() {
        this.isMounted = false;
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
            react_1.default.createElement(eui_1.EuiModal, { "data-test-subj": "dashboardCloneModal", className: "dshCloneModal", onClose: this.props.onClose },
                react_1.default.createElement(eui_1.EuiModalHeader, null,
                    react_1.default.createElement(eui_1.EuiModalHeaderTitle, null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.cloneDashboardModalHeaderTitle", defaultMessage: "Clone dashboard" }))),
                react_1.default.createElement(eui_1.EuiModalBody, null,
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement("p", null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.enterNewNameForDashboardDescription", defaultMessage: "Please enter a new name for your dashboard." }))),
                    react_1.default.createElement(eui_1.EuiSpacer, null),
                    react_1.default.createElement(eui_1.EuiFieldText, { autoFocus: true, "aria-label": i18n_1.i18n.translate('dashboard.cloneModal.cloneDashboardTitleAriaLabel', {
                            defaultMessage: 'Cloned Dashboard Title',
                        }), "data-test-subj": "clonedDashboardTitle", value: this.state.newDashboardName, onChange: this.onInputChange, isInvalid: this.state.hasTitleDuplicate }),
                    this.renderDuplicateTitleCallout()),
                react_1.default.createElement(eui_1.EuiModalFooter, null,
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { "data-test-subj": "cloneCancelButton", onClick: this.props.onClose },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.cancelButtonLabel", defaultMessage: "Cancel" })),
                    react_1.default.createElement(eui_1.EuiButton, { fill: true, "data-test-subj": "cloneConfirmButton", onClick: this.cloneDashboard, isLoading: this.state.isLoading },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "dashboard.topNav.cloneModal.confirmButtonLabel", defaultMessage: "Confirm Clone" }))))));
    }
}
exports.DashboardCloneModal = DashboardCloneModal;
