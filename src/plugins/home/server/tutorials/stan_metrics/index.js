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
function stanMetricsSpecProvider(context) {
    const moduleName = 'stan';
    return {
        id: 'stanMetrics',
        name: i18n_1.i18n.translate('home.tutorials.stanMetrics.nameTitle', {
            defaultMessage: 'STAN metrics',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.stanMetrics.shortDescription', {
            defaultMessage: 'Fetch monitoring metrics from the STAN server.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.stanMetrics.longDescription', {
            defaultMessage: 'The `stan` Metricbeat module fetches monitoring metrics from STAN. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-stan.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/stan.svg',
        artifacts: {
            dashboards: [
                {
                    id: 'dbf2e220-37ce-11ea-a9c8-152a657da3ab',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.stanMetrics.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'Stan metrics dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-stan.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/stan_metrics/screenshot.png',
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.stanMetricsSpecProvider = stanMetricsSpecProvider;
