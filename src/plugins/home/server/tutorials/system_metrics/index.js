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
function systemMetricsSpecProvider(context) {
    const moduleName = 'system';
    return {
        id: 'systemMetrics',
        name: i18n_1.i18n.translate('home.tutorials.systemMetrics.nameTitle', {
            defaultMessage: 'System metrics',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.systemMetrics.shortDescription', {
            defaultMessage: 'Collect CPU, memory, network, and disk statistics from the host.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.systemMetrics.longDescription', {
            defaultMessage: 'The `system` Metricbeat module collects CPU, memory, network, and disk statistics from the host. \
It collects system wide statistics and statistics per process and filesystem. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-system.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/system.svg',
        artifacts: {
            dashboards: [
                {
                    id: 'Metricbeat-system-overview-ecs',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.systemMetrics.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'System metrics dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-system.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/system_metrics/screenshot.png',
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.systemMetricsSpecProvider = systemMetricsSpecProvider;
