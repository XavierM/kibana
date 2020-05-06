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
const winlogbeat_instructions_1 = require("../instructions/winlogbeat_instructions");
function windowsEventLogsSpecProvider(context) {
    return {
        id: 'windowsEventLogs',
        name: i18n_1.i18n.translate('home.tutorials.windowsEventLogs.nameTitle', {
            defaultMessage: 'Windows Event Log',
        }),
        isBeta: false,
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.windowsEventLogs.shortDescription', {
            defaultMessage: 'Fetch logs from the Windows Event Log.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.windowsEventLogs.longDescription', {
            defaultMessage: 'Use Winlogbeat to collect the logs from the Windows Event Log. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.winlogbeat}/index.html',
            },
        }),
        euiIconType: 'logoWindows',
        artifacts: {
            application: {
                label: i18n_1.i18n.translate('home.tutorials.windowsEventLogs.artifacts.application.label', {
                    defaultMessage: 'SIEM App',
                }),
                path: '/app/siem',
            },
            dashboards: [],
            exportedFields: {
                documentationUrl: '{config.docs.beats.winlogbeat}/exported-fields.html',
            },
        },
        completionTimeMinutes: 10,
        onPrem: winlogbeat_instructions_1.onPremInstructions(context),
        elasticCloud: winlogbeat_instructions_1.cloudInstructions(),
        onPremElasticCloud: winlogbeat_instructions_1.onPremCloudInstructions(),
    };
}
exports.windowsEventLogsSpecProvider = windowsEventLogsSpecProvider;
