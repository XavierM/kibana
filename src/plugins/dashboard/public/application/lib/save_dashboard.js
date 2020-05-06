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
const update_saved_dashboard_1 = require("./update_saved_dashboard");
/**
 * Saves the dashboard.
 * @param toJson A custom toJson function. Used because the previous code used
 * the angularized toJson version, and it was unclear whether there was a reason not to use
 * JSON.stringify
 * @returns A promise that if resolved, will contain the id of the newly saved
 * dashboard.
 */
function saveDashboard(toJson, timeFilter, dashboardStateManager, saveOptions) {
    const savedDashboard = dashboardStateManager.savedDashboard;
    const appState = dashboardStateManager.appState;
    update_saved_dashboard_1.updateSavedDashboard(savedDashboard, appState, timeFilter, toJson);
    return savedDashboard.save(saveOptions).then((id) => {
        if (id) {
            // reset state only when save() was successful
            // e.g. save() could be interrupted if title is duplicated and not confirmed
            dashboardStateManager.lastSavedDashboardFilters = dashboardStateManager.getFilterState();
            dashboardStateManager.resetState();
        }
        return id;
    });
}
exports.saveDashboard = saveDashboard;
