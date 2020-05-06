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
const i18n_1 = require("@kbn/i18n");
const tutorials_1 = require("../../services/tutorials");
const metricbeat_instructions_1 = require("../instructions/metricbeat_instructions");
function couchbaseMetricsSpecProvider(context) {
    const moduleName = 'couchbase';
    return {
        id: 'couchbaseMetrics',
        name: i18n_1.i18n.translate('home.tutorials.couchbaseMetrics.nameTitle', {
            defaultMessage: 'Couchbase metrics',
        }),
        isBeta: false,
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.couchbaseMetrics.shortDescription', {
            defaultMessage: 'Fetch internal metrics from Couchbase.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.couchbaseMetrics.longDescription', {
            defaultMessage: 'The `couchbase` Metricbeat module fetches internal metrics from Couchbase. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-couchbase.html',
            },
        }),
        euiIconType: 'logoCouchbase',
        artifacts: {
            application: {
                label: i18n_1.i18n.translate('home.tutorials.couchbaseMetrics.artifacts.application.label', {
                    defaultMessage: 'Discover',
                }),
                path: '/app/kibana#/discover',
            },
            dashboards: [],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-couchbase.html',
            },
        },
        completionTimeMinutes: 10,
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.couchbaseMetricsSpecProvider = couchbaseMetricsSpecProvider;
