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
const path_1 = tslib_1.__importDefault(require("path"));
const i18n_1 = require("@kbn/i18n");
const saved_objects_1 = require("./saved_objects");
const field_mappings_1 = require("./field_mappings");
const flightsName = i18n_1.i18n.translate('home.sampleData.flightsSpecTitle', {
    defaultMessage: 'Sample flight data',
});
const flightsDescription = i18n_1.i18n.translate('home.sampleData.flightsSpecDescription', {
    defaultMessage: 'Sample data, visualizations, and dashboards for monitoring flight routes.',
});
const initialAppLinks = [];
exports.flightsSpecProvider = function () {
    return {
        id: 'flights',
        name: flightsName,
        description: flightsDescription,
        previewImagePath: '/plugins/kibana/home/sample_data_resources/flights/dashboard.png',
        darkPreviewImagePath: '/plugins/kibana/home/sample_data_resources/flights/dashboard_dark.png',
        overviewDashboard: '7adfa750-4c81-11e8-b3d7-01146121b73d',
        appLinks: initialAppLinks,
        defaultIndex: 'd3d7af60-4c81-11e8-b3d7-01146121b73d',
        savedObjects: saved_objects_1.getSavedObjects(),
        dataIndices: [
            {
                id: 'flights',
                dataPath: path_1.default.join(__dirname, './flights.json.gz'),
                fields: field_mappings_1.fieldMappings,
                timeFields: ['timestamp'],
                currentTimeMarker: '2018-01-09T00:00:00',
                preserveDayOfWeekTimeOfDay: true,
            },
        ],
        status: 'not_installed',
    };
};
