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
/*
 * The UI and related logic for the welcome screen that *should* show only
 * when it is enabled (the default) and there is no Kibana-consumed data
 * in Elasticsearch.
 */
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const analytics_1 = require("@kbn/analytics");
const react_2 = require("@kbn/i18n/react");
const kibana_services_1 = require("../kibana_services");
const constants_1 = require("../../../../telemetry/common/constants");
const sample_data_1 = require("./sample_data");
/**
 * Shows a full-screen welcome page that gives helpful quick links to beginners.
 */
class Welcome extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.services = kibana_services_1.getServices();
        this.hideOnEsc = (e) => {
            if (e.key === 'Escape') {
                this.props.onSkip();
            }
        };
        this.onSampleDataDecline = () => {
            this.services.trackUiMetric(analytics_1.METRIC_TYPE.CLICK, 'sampleDataDecline');
            this.props.onSkip();
        };
        this.onSampleDataConfirm = () => {
            this.services.trackUiMetric(analytics_1.METRIC_TYPE.CLICK, 'sampleDataConfirm');
            this.redirecToSampleData();
        };
        this.renderTelemetryEnabledOrDisabledText = () => {
            const { telemetry } = this.props;
            if (!telemetry) {
                return null;
            }
            const isOptedIn = telemetry.telemetryService.getIsOptedIn();
            if (isOptedIn) {
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementDisableCollection", defaultMessage: " To stop collection, " }),
                    react_1.default.createElement(eui_1.EuiLink, { href: "#/management/kibana/settings" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementDisableCollectionLink", defaultMessage: "disable usage data here." }))));
            }
            else {
                return (react_1.default.createElement(react_1.Fragment, null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementEnableCollection", defaultMessage: " To start collection, " }),
                    react_1.default.createElement(eui_1.EuiLink, { href: "#/management/kibana/settings" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementEnableCollectionLink", defaultMessage: "enable usage data here." }))));
            }
        };
    }
    redirecToSampleData() {
        const path = this.services.addBasePath('#/home/tutorial_directory/sampleData');
        window.location.href = path;
    }
    componentDidMount() {
        const { telemetry } = this.props;
        this.services.trackUiMetric(analytics_1.METRIC_TYPE.LOADED, 'welcomeScreenMount');
        if (telemetry) {
            telemetry.telemetryNotifications.setOptedInNoticeSeen();
        }
        document.addEventListener('keydown', this.hideOnEsc);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.hideOnEsc);
    }
    render() {
        const { urlBasePath, telemetry } = this.props;
        return (react_1.default.createElement(eui_1.EuiPortal, null,
            react_1.default.createElement("div", { className: "homWelcome" },
                react_1.default.createElement("header", { className: "homWelcome__header" },
                    react_1.default.createElement("div", { className: "homWelcome__content eui-textCenter" },
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "xl" }),
                        react_1.default.createElement("span", { className: "homWelcome__logo" },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "logoElastic", size: "xxl" })),
                        react_1.default.createElement(eui_1.EuiTitle, { size: "l", className: "homWelcome__title" },
                            react_1.default.createElement("h1", null,
                                react_1.default.createElement(react_2.FormattedMessage, { id: "home.welcomeTitle", defaultMessage: "Welcome to Elastic Kibana" }))),
                        react_1.default.createElement(eui_1.EuiText, { size: "s", color: "subdued", className: "homWelcome__subtitle" },
                            react_1.default.createElement("p", null,
                                react_1.default.createElement(react_2.FormattedMessage, { id: "home.welcomeDescription", defaultMessage: "Your window into the Elastic Stack" }))),
                        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }))),
                react_1.default.createElement("div", { className: "homWelcome__content homWelcome-body" },
                    react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "l" },
                        react_1.default.createElement(eui_1.EuiFlexItem, null,
                            react_1.default.createElement(sample_data_1.SampleDataCard, { urlBasePath: urlBasePath, onConfirm: this.onSampleDataConfirm, onDecline: this.onSampleDataDecline }),
                            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                            !!telemetry && (react_1.default.createElement(react_1.Fragment, null,
                                react_1.default.createElement(eui_1.EuiTextColor, { className: "euiText--small", color: "subdued" },
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementDisclaimerPrivacy", defaultMessage: "To learn about how usage data helps us manage and improve our products and services, see our " }),
                                    react_1.default.createElement(eui_1.EuiLink, { href: constants_1.PRIVACY_STATEMENT_URL, target: "_blank", rel: "noopener" },
                                        react_1.default.createElement(react_2.FormattedMessage, { id: "home.dataManagementDisclaimerPrivacyLink", defaultMessage: "Privacy Statement." })),
                                    this.renderTelemetryEnabledOrDisabledText()),
                                react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" })))))))));
    }
}
exports.Welcome = Welcome;
