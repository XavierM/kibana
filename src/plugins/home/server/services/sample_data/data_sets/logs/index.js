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
const logsName = i18n_1.i18n.translate('home.sampleData.logsSpecTitle', {
    defaultMessage: 'Sample web logs',
});
const logsDescription = i18n_1.i18n.translate('home.sampleData.logsSpecDescription', {
    defaultMessage: 'Sample data, visualizations, and dashboards for monitoring web logs.',
});
const initialAppLinks = [];
exports.logsSpecProvider = function () {
    return {
        id: 'logs',
        name: logsName,
        description: logsDescription,
        previewImagePath: '/plugins/kibana/home/sample_data_resources/logs/dashboard.png',
        darkPreviewImagePath: '/plugins/kibana/home/sample_data_resources/logs/dashboard_dark.png',
        overviewDashboard: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
        appLinks: initialAppLinks,
        defaultIndex: '90943e30-9a47-11e8-b64d-95841ca0b247',
        savedObjects: saved_objects_1.getSavedObjects(),
        dataIndices: [
            {
                id: 'logs',
                dataPath: path_1.default.join(__dirname, './logs.json.gz'),
                fields: field_mappings_1.fieldMappings,
                timeFields: ['timestamp', 'utc_time'],
                currentTimeMarker: '2018-08-01T00:00:00',
                preserveDayOfWeekTimeOfDay: true,
            },
        ],
        status: 'not_installed',
    };
};
