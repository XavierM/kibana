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
const react_1 = tslib_1.__importDefault(require("react"));
const components_1 = require("../components");
// @ts-ignore
const mappings_1 = tslib_1.__importDefault(require("../../lib/mappings/mappings"));
const contexts_1 = require("../contexts");
const getAutocompleteDiff = (newSettings, prevSettings) => {
    return Object.keys(newSettings.autocomplete).filter(key => {
        // @ts-ignore
        return prevSettings.autocomplete[key] !== newSettings.autocomplete[key];
    });
};
const refreshAutocompleteSettings = (settings, selectedSettings) => {
    mappings_1.default.retrieveAutoCompleteInfo(settings, selectedSettings);
};
const fetchAutocompleteSettingsIfNeeded = (settings, newSettings, prevSettings) => {
    // We'll only retrieve settings if polling is on. The expectation here is that if the user
    // disables polling it's because they want manual control over the fetch request (possibly
    // because it's a very expensive request given their cluster and bandwidth). In that case,
    // they would be unhappy with any request that's sent automatically.
    if (newSettings.polling) {
        const autocompleteDiff = getAutocompleteDiff(newSettings, prevSettings);
        const isSettingsChanged = autocompleteDiff.length > 0;
        const isPollingChanged = prevSettings.polling !== newSettings.polling;
        if (isSettingsChanged) {
            // If the user has changed one of the autocomplete settings, then we'll fetch just the
            // ones which have changed.
            const changedSettings = autocompleteDiff.reduce((changedSettingsAccum, setting) => {
                changedSettingsAccum[setting] = newSettings.autocomplete[setting];
                return changedSettingsAccum;
            }, {});
            mappings_1.default.retrieveAutoCompleteInfo(settings, changedSettings);
        }
        else if (isPollingChanged && newSettings.polling) {
            // If the user has turned polling on, then we'll fetch all selected autocomplete settings.
            mappings_1.default.retrieveAutoCompleteInfo(settings, settings.getAutocomplete());
        }
    }
};
function Settings({ onClose }) {
    const { services: { settings }, } = contexts_1.useServicesContext();
    const dispatch = contexts_1.useEditorActionContext();
    const onSaveSettings = (newSettings) => {
        const prevSettings = settings.toJSON();
        fetchAutocompleteSettingsIfNeeded(settings, newSettings, prevSettings);
        // Update the new settings in localStorage
        settings.updateSettings(newSettings);
        // Let the rest of the application know settings have updated.
        dispatch({
            type: 'updateSettings',
            payload: newSettings,
        });
        onClose();
    };
    return (react_1.default.createElement(components_1.DevToolsSettingsModal, { onClose: onClose, onSaveSettings: onSaveSettings, refreshAutocompleteSettings: (selectedSettings) => refreshAutocompleteSettings(settings, selectedSettings), settings: settings.toJSON() }));
}
exports.Settings = Settings;
