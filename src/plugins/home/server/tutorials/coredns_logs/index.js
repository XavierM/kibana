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
function corednsLogsSpecProvider(context) {
    const moduleName = 'coredns';
    const platforms = ['OSX', 'DEB', 'RPM'];
    return {
        id: 'corednsLogs',
        name: i18n_1.i18n.translate('home.tutorials.corednsLogs.nameTitle', {
            defaultMessage: 'CoreDNS logs',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.corednsLogs.shortDescription', {
            defaultMessage: 'Collect the logs created by Coredns.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.corednsLogs.longDescription', {
            defaultMessage: 'The `coredns` Filebeat module collects the logs from \
[CoreDNS](https://coredns.io/manual/toc/). \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-coredns.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/coredns.svg',
        artifacts: {
            dashboards: [
                {
                    id: '53aa1f70-443e-11e9-8548-ab7fbe04f038',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.corednsLogs.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'CoreDNS logs dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-coredns.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/coredns_logs/screenshot.jpg',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.corednsLogsSpecProvider = corednsLogsSpecProvider;
