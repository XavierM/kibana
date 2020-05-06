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
const i18n_1 = require("@kbn/i18n");
const react_1 = require("react");
const editor_registry_1 = require("../../contexts/editor_context/editor_registry");
const contexts_1 = require("../../contexts");
const send_request_to_es_1 = require("./send_request_to_es");
const track_1 = require("./track");
// @ts-ignore
const mappings_1 = tslib_1.__importDefault(require("../../../lib/mappings/mappings"));
exports.useSendCurrentRequestToES = () => {
    const { services: { history, settings, notifications, trackUiMetric }, } = contexts_1.useServicesContext();
    const dispatch = contexts_1.useRequestActionContext();
    return react_1.useCallback(async () => {
        try {
            const editor = editor_registry_1.instance.getInputEditor();
            const requests = await editor.getRequestsInRange();
            if (!requests.length) {
                notifications.toasts.add(i18n_1.i18n.translate('console.notification.error.noRequestSelectedTitle', {
                    defaultMessage: 'No request selected. Select a request by placing the cursor inside it.',
                }));
                return;
            }
            dispatch({ type: 'sendRequest', payload: undefined });
            // Fire and forget
            setTimeout(() => track_1.track(requests, editor, trackUiMetric), 0);
            const results = await send_request_to_es_1.sendRequestToES({ requests });
            results.forEach(({ request: { path, method, data } }) => {
                try {
                    history.addToHistory(path, method, data);
                }
                catch (e) {
                    // Best effort, but notify the user.
                    notifications.toasts.addError(e, {
                        title: i18n_1.i18n.translate('console.notification.error.couldNotSaveRequestTitle', {
                            defaultMessage: 'Could not save request to history.',
                        }),
                    });
                }
            });
            const { polling } = settings.toJSON();
            if (polling) {
                // If the user has submitted a request against ES, something in the fields, indices, aliases,
                // or templates may have changed, so we'll need to update this data. Assume that if
                // the user disables polling they're trying to optimize performance or otherwise
                // preserve resources, so they won't want this request sent either.
                mappings_1.default.retrieveAutoCompleteInfo(settings, settings.getAutocomplete());
            }
            dispatch({
                type: 'requestSuccess',
                payload: {
                    data: results,
                },
            });
        }
        catch (e) {
            if (e?.response) {
                dispatch({
                    type: 'requestFail',
                    payload: e,
                });
            }
            else {
                dispatch({
                    type: 'requestFail',
                    payload: undefined,
                });
                notifications.toasts.addError(e, {
                    title: i18n_1.i18n.translate('console.notification.error.unknownErrorTitle', {
                        defaultMessage: 'Unknown Request Error',
                    }),
                });
            }
        }
    }, [dispatch, settings, history, notifications, trackUiMetric]);
};
