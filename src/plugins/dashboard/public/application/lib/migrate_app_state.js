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
const semver_1 = tslib_1.__importDefault(require("semver"));
const i18n_1 = require("@kbn/i18n");
const analytics_1 = require("@kbn/analytics");
const common_1 = require("../../../common");
/**
 * Attempts to migrate the state stored in the URL into the latest version of it.
 *
 * Once we hit a major version, we can remove support for older style URLs and get rid of this logic.
 */
function migrateAppState(appState, kibanaVersion, usageCollection) {
    if (!appState.panels) {
        throw new Error(i18n_1.i18n.translate('dashboard.panel.invalidData', {
            defaultMessage: 'Invalid data in url',
        }));
    }
    const panelNeedsMigration = appState.panels.some(panel => {
        if (panel.version === undefined)
            return true;
        const version = panel.version;
        if (usageCollection) {
            // This will help us figure out when to remove support for older style URLs.
            usageCollection.reportUiStats('DashboardPanelVersionInUrl', analytics_1.METRIC_TYPE.LOADED, `${version}`);
        }
        return semver_1.default.satisfies(version, '<7.3');
    });
    if (panelNeedsMigration) {
        appState.panels = common_1.migratePanelsTo730(appState.panels, kibanaVersion, appState.useMargins, appState.uiState);
        delete appState.uiState;
    }
    return appState;
}
exports.migrateAppState = migrateAppState;
