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
const React = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
/**
 * React component for displaying the example data associated with the Telemetry opt-in banner.
 */
class OptInExampleFlyout extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            data: null,
            isLoading: true,
            hasPrivilegeToRead: false,
        };
    }
    async componentDidMount() {
        try {
            const { fetchExample } = this.props;
            const clusters = await fetchExample();
            this.setState({
                data: Array.isArray(clusters) ? clusters : null,
                isLoading: false,
                hasPrivilegeToRead: true,
            });
        }
        catch (err) {
            this.setState({
                isLoading: false,
                hasPrivilegeToRead: err.status !== 403,
            });
        }
    }
    renderBody({ data, isLoading, hasPrivilegeToRead }) {
        if (isLoading) {
            return (React.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceAround" },
                React.createElement(eui_1.EuiFlexItem, { grow: false },
                    React.createElement(eui_1.EuiLoadingSpinner, { size: "xl" }))));
        }
        if (!hasPrivilegeToRead) {
            return (React.createElement(eui_1.EuiCallOut, { title: React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.errorUnprivilegedUserTitle", defaultMessage: "Error displaying cluster statistics" }), color: "danger", iconType: "cross" },
                React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.errorUnprivilegedUserDescription", defaultMessage: "You do not have access to see unencrypted cluster statistics." })));
        }
        if (data === null) {
            return (React.createElement(eui_1.EuiCallOut, { title: React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.errorLoadingClusterStatisticsTitle", defaultMessage: "Error loading cluster statistics" }), color: "danger", iconType: "cross" },
                React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.errorLoadingClusterStatisticsDescription", defaultMessage: "An unexpected error occured while attempting to fetch the cluster statistics.\n              This can occur because Elasticsearch failed, Kibana failed, or there is a network error.\n              Check Kibana, then reload the page and try again." })));
        }
        return React.createElement(eui_1.EuiCodeBlock, { language: "js" }, JSON.stringify(data, null, 2));
    }
    render() {
        return (React.createElement(eui_1.EuiPortal, null,
            React.createElement(eui_1.EuiFlyout, { ownFocus: true, onClose: this.props.onClose, maxWidth: true },
                React.createElement(eui_1.EuiFlyoutHeader, null,
                    React.createElement(eui_1.EuiTitle, null,
                        React.createElement("h2", null,
                            React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.clusterStatisticsTitle", defaultMessage: "Cluster statistics" }))),
                    React.createElement(eui_1.EuiTextColor, { color: "subdued" },
                        React.createElement(eui_1.EuiText, null,
                            React.createElement(react_1.FormattedMessage, { id: "telemetry.callout.clusterStatisticsDescription", defaultMessage: "This is an example of the basic cluster statistics that we'll collect.\n                  It includes the number of indices, shards, and nodes.\n                  It also includes high-level usage statistics, such as whether monitoring is turned on." })))),
                React.createElement(eui_1.EuiFlyoutBody, null, this.renderBody(this.state)))));
    }
}
exports.OptInExampleFlyout = OptInExampleFlyout;
