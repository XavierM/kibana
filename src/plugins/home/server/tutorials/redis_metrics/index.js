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
function redisMetricsSpecProvider(context) {
    const moduleName = 'redis';
    return {
        id: 'redisMetrics',
        name: i18n_1.i18n.translate('home.tutorials.redisMetrics.nameTitle', {
            defaultMessage: 'Redis metrics',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.redisMetrics.shortDescription', {
            defaultMessage: 'Fetch internal metrics from Redis.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.redisMetrics.longDescription', {
            defaultMessage: 'The `redis` Metricbeat module fetches internal metrics from the Redis server. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-redis.html',
            },
        }),
        euiIconType: 'logoRedis',
        artifacts: {
            dashboards: [
                {
                    id: 'AV4YjZ5pux-M-tCAunxK-ecs',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.redisMetrics.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'Redis metrics dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-redis.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/redis_metrics/screenshot.png',
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.redisMetricsSpecProvider = redisMetricsSpecProvider;
