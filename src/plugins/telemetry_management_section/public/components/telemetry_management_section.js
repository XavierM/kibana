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
const i18n_1 = require("@kbn/i18n");
const constants_1 = require("../../../telemetry/common/constants");
const opt_in_example_flyout_1 = require("./opt_in_example_flyout");
const public_1 = require("../../../advanced_settings/public");
const SEARCH_TERMS = ['telemetry', 'usage', 'data', 'usage data'];
class TelemetryManagementSection extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            processing: false,
            showExample: false,
            queryMatches: null,
            enabled: this.props.telemetryService.getIsOptedIn() || false,
        };
        this.maybeGetAppliesSettingMessage = () => {
            if (!this.props.showAppliesSettingMessage) {
                return null;
            }
            return (react_1.default.createElement(eui_1.EuiCallOut, { color: "primary", iconType: "spacesApp", title: react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.callout.appliesSettingTitle", defaultMessage: "Changes to this setting apply to {allOfKibanaText} and are saved automatically.", values: {
                            allOfKibanaText: (react_1.default.createElement("strong", null,
                                react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.callout.appliesSettingTitle.allOfKibanaText", defaultMessage: "all of Kibana" }))),
                        } })) }));
        };
        this.renderDescription = () => (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("p", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.telemetryConfigAndLinkDescription", defaultMessage: "Enabling data usage collection helps us manage and improve our products and services.\n          See our {privacyStatementLink} for more details.", values: {
                        privacyStatementLink: (react_1.default.createElement(eui_1.EuiLink, { href: constants_1.PRIVACY_STATEMENT_URL, target: "_blank" },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.readOurUsageDataPrivacyStatementLinkText", defaultMessage: "Privacy Statement" }))),
                    } })),
            react_1.default.createElement("p", null,
                react_1.default.createElement(eui_1.EuiLink, { onClick: this.toggleExample },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.seeExampleOfWhatWeCollectLinkText", defaultMessage: "See an example of what we collect" })))));
        this.toggleOptIn = async () => {
            const { telemetryService, toasts } = this.props;
            const newOptInValue = !this.state.enabled;
            return new Promise((resolve, reject) => {
                this.setState({
                    processing: true,
                    enabled: newOptInValue,
                }, async () => {
                    try {
                        await telemetryService.setOptIn(newOptInValue);
                        this.setState({ processing: false });
                        toasts.addSuccess(newOptInValue
                            ? i18n_1.i18n.translate('telemetry.optInSuccessOn', {
                                defaultMessage: 'Usage data collection turned on.',
                            })
                            : i18n_1.i18n.translate('telemetry.optInSuccessOff', {
                                defaultMessage: 'Usage data collection turned off.',
                            }));
                        resolve(true);
                    }
                    catch (err) {
                        this.setState({ processing: false });
                        reject(err);
                    }
                });
            });
        };
        this.toggleExample = () => {
            this.setState({
                showExample: !this.state.showExample,
            });
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        const { query } = nextProps;
        const searchTerm = (query.text || '').toLowerCase();
        const searchTermMatches = this.props.telemetryService.getCanChangeOptInStatus() &&
            SEARCH_TERMS.some(term => term.indexOf(searchTerm) >= 0);
        if (searchTermMatches !== this.state.queryMatches) {
            this.setState({
                queryMatches: searchTermMatches,
            }, () => {
                this.props.onQueryMatchChange(searchTermMatches);
            });
        }
    }
    render() {
        const { telemetryService } = this.props;
        const { showExample, queryMatches, enabled, processing } = this.state;
        if (!telemetryService.getCanChangeOptInStatus()) {
            return null;
        }
        if (queryMatches !== null && !queryMatches) {
            return null;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            showExample && (react_1.default.createElement(opt_in_example_flyout_1.OptInExampleFlyout, { fetchExample: telemetryService.fetchExample, onClose: this.toggleExample })),
            react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
                react_1.default.createElement(eui_1.EuiForm, null,
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "baseline" },
                            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                react_1.default.createElement("h2", null,
                                    react_1.default.createElement(react_2.FormattedMessage, { id: "telemetry.usageDataTitle", defaultMessage: "Usage Data" }))))),
                    this.maybeGetAppliesSettingMessage(),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                    react_1.default.createElement(public_1.Field, { setting: {
                            type: 'boolean',
                            name: 'telemetry:enabled',
                            displayName: i18n_1.i18n.translate('telemetry.provideUsageStatisticsTitle', {
                                defaultMessage: 'Provide usage statistics',
                            }),
                            value: enabled,
                            description: this.renderDescription(),
                            defVal: true,
                            ariaName: i18n_1.i18n.translate('telemetry.provideUsageStatisticsAriaName', {
                                defaultMessage: 'Provide usage statistics',
                            }),
                        }, loading: processing, dockLinks: null, toasts: null, handleChange: this.toggleOptIn, enableSaving: this.props.enableSaving })))));
    }
}
exports.TelemetryManagementSection = TelemetryManagementSection;
