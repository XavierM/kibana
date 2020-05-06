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
exports.Header = ({ onExportAll, onImport, onRefresh, filteredCount, }) => (react_1.default.createElement(react_1.Fragment, null,
    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "baseline" },
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiTitle, null,
                react_1.default.createElement("h1", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.header.savedObjectsTitle", defaultMessage: "Saved Objects" })))),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "baseline", gutterSize: "m", responsive: false },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", iconType: "exportAction", "data-test-subj": "exportAllObjects", onClick: onExportAll },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.header.exportButtonLabel", defaultMessage: "Export {filteredCount, plural, one{# object} other {# objects}}", values: {
                                filteredCount,
                            } }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", iconType: "importAction", "data-test-subj": "importObjects", onClick: onImport },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.header.importButtonLabel", defaultMessage: "Import" }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", iconType: "refresh", onClick: onRefresh },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.header.refreshButtonLabel", defaultMessage: "Refresh" })))))),
    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
    react_1.default.createElement(eui_1.EuiText, { size: "s" },
        react_1.default.createElement("p", null,
            react_1.default.createElement(eui_1.EuiTextColor, { color: "subdued" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.howToDeleteSavedObjectsDescription", defaultMessage: "From here you can delete saved objects, such as saved searches.\n            You can also edit the raw data of saved objects.\n            Typically objects are only modified via their associated application,\n            which is probably what you should use instead of this screen." })))),
    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
