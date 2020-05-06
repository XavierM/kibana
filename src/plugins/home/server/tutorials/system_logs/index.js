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
function systemLogsSpecProvider(context) {
    const moduleName = 'system';
    const platforms = ['OSX', 'DEB', 'RPM'];
    return {
        id: 'systemLogs',
        name: i18n_1.i18n.translate('home.tutorials.systemLogs.nameTitle', {
            defaultMessage: 'System logs',
        }),
        category: tutorials_1.TutorialsCategory.LOGGING,
        shortDescription: i18n_1.i18n.translate('home.tutorials.systemLogs.shortDescription', {
            defaultMessage: 'Collect and parse logs written by the local Syslog server.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.systemLogs.longDescription', {
            defaultMessage: 'The `system` Filebeat module collects and parses logs created by the system logging service of common \
Unix/Linux based distributions. This module is not available on Windows. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-system.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/system.svg',
        artifacts: {
            dashboards: [
                {
                    id: 'Filebeat-syslog-dashboard-ecs',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.systemLogs.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'System logs dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-system.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/system_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.systemLogsSpecProvider = systemLogsSpecProvider;
