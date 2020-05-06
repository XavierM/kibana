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
const auditbeat_instructions_1 = require("../instructions/auditbeat_instructions");
function auditbeatSpecProvider(context) {
    const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
    return {
        id: 'auditbeat',
        name: i18n_1.i18n.translate('home.tutorials.auditbeat.nameTitle', {
            defaultMessage: 'Auditbeat',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.auditbeat.shortDescription', {
            defaultMessage: 'Collect audit data from your hosts.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.auditbeat.longDescription', {
            defaultMessage: 'Use Auditbeat to collect auditing data from your hosts. These include \
processes, users, logins, sockets information, file accesses, and more. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.auditbeat}/auditbeat-overview.html',
            },
        }),
        euiIconType: 'securityAnalyticsApp',
        artifacts: {
            dashboards: [],
            application: {
                path: '/app/siem',
                label: i18n_1.i18n.translate('home.tutorials.auditbeat.artifacts.dashboards.linkLabel', {
                    defaultMessage: 'SIEM App',
                }),
            },
            exportedFields: {
                documentationUrl: '{config.docs.beats.auditbeat}/exported-fields.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/auditbeat/screenshot.png',
        onPrem: auditbeat_instructions_1.onPremInstructions(platforms, context),
        elasticCloud: auditbeat_instructions_1.cloudInstructions(platforms),
        onPremElasticCloud: auditbeat_instructions_1.onPremCloudInstructions(platforms),
    };
}
exports.auditbeatSpecProvider = auditbeatSpecProvider;
