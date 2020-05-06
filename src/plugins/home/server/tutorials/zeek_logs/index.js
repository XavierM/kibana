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
function zeekLogsSpecProvider(context) {
    const moduleName = 'zeek';
    const platforms = ['OSX', 'DEB', 'RPM'];
    return {
        id: 'zeekLogs',
        name: i18n_1.i18n.translate('home.tutorials.zeekLogs.nameTitle', {
            defaultMessage: 'Zeek logs',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.zeekLogs.shortDescription', {
            defaultMessage: 'Collect the logs created by Zeek/Bro.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.zeekLogs.longDescription', {
            defaultMessage: 'The `zeek` Filebeat module collects the logs from \
[Zeek](https://www.zeek.org//documentation/index.html). \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-zeek.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/zeek.svg',
        artifacts: {
            dashboards: [
                {
                    id: '7cbb5410-3700-11e9-aa6d-ff445a78330c',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.zeekLogs.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'Zeek logs dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-zeek.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/zeek_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.zeekLogsSpecProvider = zeekLogsSpecProvider;
