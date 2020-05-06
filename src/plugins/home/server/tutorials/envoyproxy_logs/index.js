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
function envoyproxyLogsSpecProvider(context) {
    const moduleName = 'envoyproxy';
    const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
    return {
        id: 'envoyproxyLogs',
        name: i18n_1.i18n.translate('home.tutorials.envoyproxyLogs.nameTitle', {
            defaultMessage: 'Envoyproxy',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.envoyproxyLogs.shortDescription', {
            defaultMessage: 'Collect and parse logs received from the Envoy proxy.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.envoyproxyLogs.longDescription', {
            defaultMessage: 'This is a filebeat module for [Envoy proxy access log](https://www.envoyproxy.io/docs/envoy/v1.10.0/configuration/access_log). \
It supports both standalone deployment and Envoy proxy deployment in Kubernetes. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-envoyproxy.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/envoyproxy.svg',
        artifacts: {
            dashboards: [],
            application: {
                path: '/app/siem',
                label: i18n_1.i18n.translate('home.tutorials.envoyproxyLogs.artifacts.dashboards.linkLabel', {
                    defaultMessage: 'SIEM App',
                }),
            },
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-envoyproxy.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/envoyproxy_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.envoyproxyLogsSpecProvider = envoyproxyLogsSpecProvider;
