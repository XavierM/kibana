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
const joi_1 = tslib_1.__importDefault(require("joi"));
const dataIndexSchema = joi_1.default.object({
    id: joi_1.default.string()
        .regex(/^[a-zA-Z0-9-]+$/)
        .required(),
    // path to newline delimented JSON file containing data relative to KIBANA_HOME
    dataPath: joi_1.default.string().required(),
    // Object defining Elasticsearch field mappings (contents of index.mappings.type.properties)
    fields: joi_1.default.object().required(),
    // times fields that will be updated relative to now when data is installed
    timeFields: joi_1.default.array()
        .items(joi_1.default.string())
        .required(),
    // Reference to now in your test data set.
    // When data is installed, timestamps are converted to the present time.
    // The distance between a timestamp and currentTimeMarker is preserved but the date and time will change.
    // For example:
    //   sample data set:    timestamp: 2018-01-01T00:00:00Z, currentTimeMarker: 2018-01-01T12:00:00Z
    //   installed data set: timestamp: 2018-04-18T20:33:14Z, currentTimeMarker: 2018-04-19T08:33:14Z
    currentTimeMarker: joi_1.default.string()
        .isoDate()
        .required(),
    // Set to true to move timestamp to current week, preserving day of week and time of day
    // Relative distance from timestamp to currentTimeMarker will not remain the same
    preserveDayOfWeekTimeOfDay: joi_1.default.boolean().default(false),
});
const appLinkSchema = joi_1.default.object({
    path: joi_1.default.string().required(),
    label: joi_1.default.string().required(),
    icon: joi_1.default.string().required(),
});
exports.sampleDataSchema = {
    id: joi_1.default.string()
        .regex(/^[a-zA-Z0-9-]+$/)
        .required(),
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    previewImagePath: joi_1.default.string().required(),
    darkPreviewImagePath: joi_1.default.string(),
    // saved object id of main dashboard for sample data set
    overviewDashboard: joi_1.default.string().required(),
    appLinks: joi_1.default.array()
        .items(appLinkSchema)
        .default([]),
    // saved object id of default index-pattern for sample data set
    defaultIndex: joi_1.default.string().required(),
    // Kibana saved objects (index patter, visualizations, dashboard, ...)
    // Should provide a nice demo of Kibana's functionality with the sample data set
    savedObjects: joi_1.default.array()
        .items(joi_1.default.object())
        .required(),
    dataIndices: joi_1.default.array()
        .items(dataIndexSchema)
        .required(),
};
