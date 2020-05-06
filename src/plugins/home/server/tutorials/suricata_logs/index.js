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
function suricataLogsSpecProvider(context) {
    const moduleName = 'suricata';
    const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
    return {
        id: 'suricataLogs',
        name: i18n_1.i18n.translate('home.tutorials.suricataLogs.nameTitle', {
            defaultMessage: 'Suricata logs',
        }),
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.suricataLogs.shortDescription', {
            defaultMessage: 'Collect the result logs created by Suricata IDS/IPS/NSM.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.suricataLogs.longDescription', {
            defaultMessage: 'The `suricata` Filebeat module collects the logs from the \
[Suricata Eve JSON output](https://suricata.readthedocs.io/en/latest/output/eve/eve-json-format.html). \
[Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-suricata.html',
            },
        }),
        euiIconType: '/plugins/kibana/home/tutorial_resources/logos/suricata.svg',
        artifacts: {
            dashboards: [
                {
                    id: '69f5ae20-eb02-11e7-8f04-51231daa5b05',
                    linkLabel: i18n_1.i18n.translate('home.tutorials.suricataLogs.artifacts.dashboards.linkLabel', {
                        defaultMessage: 'Suricata logs dashboard',
                    }),
                    isOverview: true,
                },
            ],
            exportedFields: {
                documentationUrl: '{config.docs.beats.filebeat}/exported-fields-suricata.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/suricata_logs/screenshot.png',
        onPrem: filebeat_instructions_1.onPremInstructions(moduleName, platforms, context),
        elasticCloud: filebeat_instructions_1.cloudInstructions(moduleName, platforms),
        onPremElasticCloud: filebeat_instructions_1.onPremCloudInstructions(moduleName, platforms),
    };
}
exports.suricataLogsSpecProvider = suricataLogsSpecProvider;
