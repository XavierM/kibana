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
const embeddable_plugin_1 = require("../../embeddable_plugin");
function getAppStateDefaults(savedDashboard, hideWriteControls) {
    return {
        fullScreenMode: false,
        title: savedDashboard.title,
        description: savedDashboard.description || '',
        timeRestore: savedDashboard.timeRestore,
        panels: savedDashboard.panelsJSON ? JSON.parse(savedDashboard.panelsJSON) : [],
        options: savedDashboard.optionsJSON ? JSON.parse(savedDashboard.optionsJSON) : {},
        query: savedDashboard.getQuery(),
        filters: savedDashboard.getFilters(),
        viewMode: savedDashboard.id || hideWriteControls ? embeddable_plugin_1.ViewMode.VIEW : embeddable_plugin_1.ViewMode.EDIT,
    };
}
exports.getAppStateDefaults = getAppStateDefaults;
