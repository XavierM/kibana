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
function iptablesLogsSpecProvider(context) {
    const moduleName = 'iptables';
    const platforms = ['DEB', 'RPM'];
    return {
        id: 'iptablesLogs',
        name: i18n_1.i18n.translate('home.tutorials.iptablesLogs.nameTitle', {
            defaultMessage: 'Iptables / Ubiquiti',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.iptablesLogs.shortDescription', {
            defaultMessage: 'Collect and parse iptables and ip6tables logs or from Ubiqiti firewalls.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.iptablesLogs.longDescription', {
            defaultMessage: 'This is a module for iptables and ip6tables logs. It parses logs \
received over the network via syslog or from a file. Also, it understands the \
prefix added by some Ubiquiti firewalls, which includes the rule set name, rule \
number and the action performed on the traffic (allow/deny).. \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-iptables.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/ubiquiti.svg',
        artifacts: {
            dashboards: [],
            application: {
                path: '/app/siem',
                label: i18n_1.i18n.translate('home.tutorials.iptablesLogs.artifacts.dashboards.linkLabel', {
                    defaultMessage: 'SIEM App',
                }),
            },
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-iptables.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/iptables_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.iptablesLogsSpecProvider = iptablesLogsSpecProvider;
