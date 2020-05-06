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
const ecommerceName = i18n_1.i18n.translate('home.sampleData.ecommerceSpecTitle', {
    defaultMessage: 'Sample eCommerce orders',
});
const ecommerceDescription = i18n_1.i18n.translate('home.sampleData.ecommerceSpecDescription', {
    defaultMessage: 'Sample data, visualizations, and dashboards for tracking eCommerce orders.',
});
const initialAppLinks = [];
exports.ecommerceSpecProvider = function () {
    return {
        id: 'ecommerce',
        name: ecommerceName,
        description: ecommerceDescription,
        previewImagePath: '/plugins/kibana/home/sample_data_resources/ecommerce/dashboard.png',
        darkPreviewImagePath: '/plugins/kibana/home/sample_data_resources/ecommerce/dashboard_dark.png',
        overviewDashboard: '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
        appLinks: initialAppLinks,
        defaultIndex: 'ff959d40-b880-11e8-a6d9-e546fe2bba5f',
        savedObjects: saved_objects_1.getSavedObjects(),
        dataIndices: [
            {
                id: 'ecommerce',
                dataPath: path_1.default.join(__dirname, './ecommerce.json.gz'),
                fields: field_mappings_1.fieldMappings,
                timeFields: ['order_date'],
                currentTimeMarker: '2016-12-11T00:00:00',
                preserveDayOfWeekTimeOfDay: true,
            },
        ],
        status: 'not_installed',
    };
};
