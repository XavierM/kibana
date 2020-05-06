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
function phpfpmMetricsSpecProvider(context) {
    const moduleName = 'php_fpm';
    return {
        id: 'phpfpmMetrics',
        name: i18n_1.i18n.translate('home.tutorials.phpFpmMetrics.nameTitle', {
            defaultMessage: 'PHP-FPM metrics',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        isBeta: false,
        shortDescription: i18n_1.i18n.translate('home.tutorials.phpFpmMetrics.shortDescription', {
            defaultMessage: 'Fetch internal metrics from PHP-FPM.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.phpFpmMetrics.longDescription', {
            defaultMessage: 'The `php_fpm` Metricbeat module fetches internal metrics from the PHP-FPM server. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-php_fpm.html',
            },
        }),
        euiIconType: 'logoPhp',
        artifacts: {
            dashboards: [
            /* {
              id: 'TODO',
              linkLabel: 'PHP-FPM metrics dashboard',
              isOverview: true
            }*/
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-php_fpm.html',
            },
        },
        completionTimeMinutes: 10,
        // previewImagePath: '/plugins/kibana/home/tutorial_resources/php_fpm_metrics/screenshot.png',
        onPrem: metricbeat_instructions_1.onPremInstructions(moduleName, context),
        elasticCloud: metricbeat_instructions_1.cloudInstructions(moduleName),
        onPremElasticCloud: metricbeat_instructions_1.onPremCloudInstructions(moduleName),
    };
}
exports.phpfpmMetricsSpecProvider = phpfpmMetricsSpecProvider;
