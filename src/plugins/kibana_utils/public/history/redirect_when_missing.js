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
const public_1 = require("../../../kibana_react/public");
/**
 * Creates an error handler that will redirect to a url when a SavedObjectNotFound
 * error is thrown
 */
function redirectWhenMissing({ history, mapping, toastNotifications, onBeforeRedirect, }) {
    let localMappingObject;
    if (typeof mapping === 'string') {
        localMappingObject = { '*': mapping };
    }
    else {
        localMappingObject = mapping;
    }
    return (error) => {
        // if this error is not "404", rethrow
        // we can't check "error instanceof SavedObjectNotFound" since this class can live in a separate bundle
        // and the error will be an instance of other class with the same interface (actually the copy of SavedObjectNotFound class)
        if (!error.savedObjectType) {
            throw error;
        }
        let url = localMappingObject[error.savedObjectType] || localMappingObject['*'] || '/';
        url += (url.indexOf('?') >= 0 ? '&' : '?') + `notFound=${error.savedObjectType}`;
        toastNotifications.addWarning({
            title: i18n_1.i18n.translate('kibana_utils.history.savedObjectIsMissingNotificationMessage', {
                defaultMessage: 'Saved object is missing',
            }),
            text: public_1.toMountPoint(react_1.default.createElement(public_1.MarkdownSimple, null, error.message)),
        });
        if (onBeforeRedirect) {
            onBeforeRedirect(error);
        }
        history.replace(url);
    };
}
exports.redirectWhenMissing = redirectWhenMissing;
