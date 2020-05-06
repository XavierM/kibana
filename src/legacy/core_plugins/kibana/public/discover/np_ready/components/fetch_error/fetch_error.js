"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const kibana_services_1 = require("../../../kibana_services");
const DiscoverFetchError = ({ fetchError }) => {
    if (!fetchError) {
        return null;
    }
    let body;
    if (fetchError.lang === 'painless') {
        const { chrome } = kibana_services_1.getServices();
        const mangagementUrlObj = chrome.navLinks.get('kibana:stack_management');
        const managementUrl = mangagementUrlObj ? mangagementUrlObj.url : '';
        const url = `${managementUrl}/kibana/index_patterns`;
        body = (react_1.default.createElement("p", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.fetchError.howToAddressErrorDescription", defaultMessage: "You can address this error by editing the {fetchErrorScript} field\n            in {managementLink}, under the {scriptedFields} tab.", values: {
                    fetchErrorScript: `'${fetchError.script}'`,
                    scriptedFields: (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.fetchError.scriptedFieldsText", defaultMessage: "\u201CScripted fields\u201D" })),
                    managementLink: (react_1.default.createElement("a", { href: url },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.discover.fetchError.managmentLinkText", defaultMessage: "Management > Index Patterns" }))),
                } })));
    }
    return (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xl" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "center", "data-test-subj": "discoverFetchError" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "discoverFetchError" },
                    react_1.default.createElement(eui_1.EuiCallOut, { title: fetchError.message, color: "danger", iconType: "cross" },
                        body,
                        react_1.default.createElement(eui_1.EuiCodeBlock, null, fetchError.error)))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xl" }))));
};
function createFetchErrorDirective(reactDirective) {
    return reactDirective(DiscoverFetchError);
}
exports.createFetchErrorDirective = createFetchErrorDirective;
kibana_services_1.getAngularModule().directive('discoverFetchError', createFetchErrorDirective);
