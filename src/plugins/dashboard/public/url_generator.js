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
const public_1 = require("../../data/public");
const public_2 = require("../../kibana_utils/public");
exports.STATE_STORAGE_KEY = '_a';
exports.GLOBAL_STATE_STORAGE_KEY = '_g';
exports.DASHBOARD_APP_URL_GENERATOR = 'DASHBOARD_APP_URL_GENERATOR';
exports.createDirectAccessDashboardLinkGenerator = (getStartServices) => ({
    id: exports.DASHBOARD_APP_URL_GENERATOR,
    createUrl: async (state) => {
        const startServices = await getStartServices();
        const useHash = state.useHash ?? startServices.useHashedUrl;
        const appBasePath = startServices.appBasePath;
        const hash = state.dashboardId ? `dashboard/${state.dashboardId}` : `dashboard`;
        const getSavedFiltersFromDestinationDashboardIfNeeded = async () => {
            if (state.preserveSavedFilters === false)
                return [];
            if (!state.dashboardId)
                return [];
            try {
                const dashboard = await startServices.savedDashboardLoader.get(state.dashboardId);
                return dashboard?.searchSource?.getField('filter') ?? [];
            }
            catch (e) {
                // in case dashboard is missing, built the url without those filters
                // dashboard app will handle redirect to landing page with toast message
                return [];
            }
        };
        const cleanEmptyKeys = (stateObj) => {
            Object.keys(stateObj).forEach(key => {
                if (stateObj[key] === undefined) {
                    delete stateObj[key];
                }
            });
            return stateObj;
        };
        // leave filters `undefined` if no filters was applied
        // in this case dashboard will restore saved filters on its own
        const filters = state.filters && [
            ...(await getSavedFiltersFromDestinationDashboardIfNeeded()),
            ...state.filters,
        ];
        const appStateUrl = public_2.setStateToKbnUrl(exports.STATE_STORAGE_KEY, cleanEmptyKeys({
            query: state.query,
            filters: filters?.filter(f => !public_1.esFilters.isFilterPinned(f)),
        }), { useHash }, `${appBasePath}#/${hash}`);
        return public_2.setStateToKbnUrl(exports.GLOBAL_STATE_STORAGE_KEY, cleanEmptyKeys({
            time: state.timeRange,
            filters: filters?.filter(f => public_1.esFilters.isFilterPinned(f)),
            refreshInterval: state.refreshInterval,
        }), { useHash }, appStateUrl);
    },
});
