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
const metricbeat_instructions_1 = require("../instructions/metricbeat_instructions");
const tutorials_registry_types_1 = require("../../services/tutorials/lib/tutorials_registry_types");
function aerospikeMetricsSpecProvider(context) {
    const moduleName = 'aerospike';
    return {
        id: 'aerospikeMetrics',
        name: i18n_1.i18n.translate('home.tutorials.aerospikeMetrics.nameTitle', {
            defaultMessage: 'Aerospike metrics',
        }),
        isBeta: false,
        category: tutorials_registry_types_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.aerospikeMetrics.shortDescription', {
            defaultMessage: 'Fetch internal metrics from the Aerospike server.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.aerospikeMetrics.longDescription', {
            defaultMessage: 'The `aerospike` Metricbeat module fetches internal metrics from Aerospike. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-aerospike.html',
            },
        }),
        euiIconType: 'logoAerospike',
        artifacts: {
            application: {
                label: i18n_1.i18n.translate('home.tutorials.aerospikeMetrics.artifacts.application.label', {
                    defaultMessage: 'Discover',
                }),
                path: '/app/kibana#/discover',
            },
            dashboards: [],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-aerospike.html',
            },
        },
        completionTimeMinutes: 10,
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.aerospikeMetricsSpecProvider = aerospikeMetricsSpecProvider;
