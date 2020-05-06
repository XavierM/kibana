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
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
exports.Header = ({ canEdit, canDelete, canViewInApp, type, viewUrl, onDeleteClick, }) => {
    return (react_1.default.createElement(eui_1.EuiPageContentHeader, null,
        react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
            react_1.default.createElement(eui_1.EuiTitle, null, canEdit ? (react_1.default.createElement("h1", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.editItemTitle", defaultMessage: "Edit {title}", values: { title: type } }))) : (react_1.default.createElement("h1", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.viewItemTitle", defaultMessage: "View {title}", values: { title: type } }))))),
        react_1.default.createElement(eui_1.EuiPageContentHeaderSection, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { responsive: false },
                canViewInApp && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButton, { size: "s", href: viewUrl, iconType: "eye", "data-test-subj": "savedObjectEditViewInApp" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.viewItemButtonLabel", defaultMessage: "View {title}", values: { title: type } })))),
                canDelete && (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButton, { color: "danger", size: "s", iconType: "trash", onClick: () => onDeleteClick(), "data-test-subj": "savedObjectEditDelete" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.deleteItemButtonLabel", defaultMessage: "Delete {title}", values: { title: type } }))))))));
};
