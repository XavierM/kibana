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
const filebeat_instructions_1 = require("../instructions/filebeat_instructions");
function apacheLogsSpecProvider(context) {
    const moduleName = 'apache';
    const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
    return {
        id: 'apacheLogs',
        name: i18n_1.i18n.translate('home.tutorials.apacheLogs.nameTitle', {
            defaultMessage: 'Apache logs',
        }),
        category: tutorials_1.TutorialsCategory.LOGGING,
        shortDescription: i18n_1.i18n.translate('home.tutorials.apacheLogs.shortDescription', {
            defaultMessage: 'Collect and parse access and error logs created by the Apache HTTP server.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.apacheLogs.longDescription', {
            defaultMessage: 'The apache Filebeat module parses access and error logs created by the Apache HTTP server. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-apache.html',
            },
        }),
        euiIconType: 'logoApache',
        artifacts: {
            dashboards: [
                {
                    id: 'Filebeat-Apache-Dashboard-ecs',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.apacheLogs.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'Apache logs dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-apache.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/apache_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.apacheLogsSpecProvider = apacheLogsSpecProvider;
