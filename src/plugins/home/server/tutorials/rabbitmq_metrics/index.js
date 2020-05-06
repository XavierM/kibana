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
function rabbitmqMetricsSpecProvider(context) {
    const moduleName = 'rabbitmq';
    return {
        id: 'rabbitmqMetrics',
        name: i18n_1.i18n.translate('home.tutorials.rabbitmqMetrics.nameTitle', {
            defaultMessage: 'RabbitMQ metrics',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.rabbitmqMetrics.shortDescription', {
            defaultMessage: 'Fetch internal metrics from the RabbitMQ server.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.rabbitmqMetrics.longDescription', {
            defaultMessage: 'The `rabbitmq` Metricbeat module fetches internal metrics from the RabbitMQ server. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-rabbitmq.html',
            },
        }),
        euiIconType: 'logoRabbitmq',
        isBeta: false,
        artifacts: {
            dashboards: [
                {
                    id: 'AV4YobKIge1VCbKU_qVo-ecs',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.rabbitmqMetrics.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'RabbitMQ metrics dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-rabbitmq.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/rabbitmq_metrics/screenshot.png',
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.rabbitmqMetricsSpecProvider = rabbitmqMetricsSpecProvider;
