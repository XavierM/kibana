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
exports.NotFoundErrors = ({ type }) => {
    const getMessage = () => {
        switch (type) {
            case 'search':
                return (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.savedSearchDoesNotExistErrorMessage", defaultMessage: "The saved search associated with this object no longer exists." }));
            case 'index-pattern':
                return (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.indexPatternDoesNotExistErrorMessage", defaultMessage: "The index pattern associated with this object no longer exists." }));
            case 'index-pattern-field':
                return (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.fieldDoesNotExistErrorMessage", defaultMessage: "A field associated with this object no longer exists in the index pattern." }));
            default:
                return null;
        }
    };
    return (react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.savedObjectProblemErrorMessage", defaultMessage: "There is a problem with this saved object" }), iconType: "alert", color: "danger" },
        react_1.default.createElement("div", null, getMessage()),
        react_1.default.createElement("div", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.view.howToFixErrorDescription", defaultMessage: "If you know what this error means, go ahead and fix it \u2014 otherwise click the delete button above." }))));
};
