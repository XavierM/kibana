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
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const setDefaultAriaLabel = i18n_1.i18n.translate('kbn.management.editIndexPattern.setDefaultAria', {
    defaultMessage: 'Set as default index.',
});
const setDefaultTooltip = i18n_1.i18n.translate('kbn.management.editIndexPattern.setDefaultTooltip', {
    defaultMessage: 'Set as default index.',
});
const refreshAriaLabel = i18n_1.i18n.translate('kbn.management.editIndexPattern.refreshAria', {
    defaultMessage: 'Reload field list.',
});
const refreshTooltip = i18n_1.i18n.translate('kbn.management.editIndexPattern.refreshTooltip', {
    defaultMessage: 'Refresh field list.',
});
const removeAriaLabel = i18n_1.i18n.translate('kbn.management.editIndexPattern.removeAria', {
    defaultMessage: 'Remove index pattern.',
});
const removeTooltip = i18n_1.i18n.translate('kbn.management.editIndexPattern.removeTooltip', {
    defaultMessage: 'Remove index pattern.',
});
function IndexHeader({ defaultIndex, indexPattern, setDefault, refreshFields, deleteIndexPattern, }) {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center" },
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center" },
                defaultIndex === indexPattern.id && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false, style: { marginRight: 0 } },
                    react_1.default.createElement(eui_1.EuiIcon, { size: "xl", type: "starFilled" }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { style: defaultIndex === indexPattern.id ? { marginLeft: 0 } : {} },
                    react_1.default.createElement(eui_1.EuiTitle, null,
                        react_1.default.createElement("h1", { "data-test-subj": "indexPatternTitle" }, indexPattern.title))))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                setDefault && (react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiToolTip, { content: setDefaultTooltip },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { color: "text", onClick: setDefault, iconType: "starFilled", "aria-label": setDefaultAriaLabel, "data-test-subj": "setDefaultIndexPatternButton" })))),
                refreshFields && (react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiToolTip, { content: refreshTooltip },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { color: "text", onClick: refreshFields, iconType: "refresh", "aria-label": refreshAriaLabel, "data-test-subj": "refreshFieldsIndexPatternButton" })))),
                deleteIndexPattern && (react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(eui_1.EuiToolTip, { content: removeTooltip },
                        react_1.default.createElement(eui_1.EuiButtonIcon, { color: "danger", onClick: deleteIndexPattern, iconType: "trash", "aria-label": removeAriaLabel, "data-test-subj": "deleteIndexPatternButton" }))))))));
}
exports.IndexHeader = IndexHeader;
