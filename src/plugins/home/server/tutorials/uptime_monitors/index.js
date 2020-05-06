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
const heartbeat_instructions_1 = require("../instructions/heartbeat_instructions");
function uptimeMonitorsSpecProvider(context) {
    return {
        id: 'uptimeMonitors',
        name: i18n_1.i18n.translate('home.tutorials.uptimeMonitors.nameTitle', {
            defaultMessage: 'Uptime Monitors',
        }),
        category: tutorials_1.TutorialsCategory.METRICS,
        shortDescription: i18n_1.i18n.translate('home.tutorials.uptimeMonitors.shortDescription', {
            defaultMessage: 'Monitor services for their availability',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.uptimeMonitors.longDescription', {
            defaultMessage: 'Monitor services for their availability with active probing. \
        Given a list of URLs, Heartbeat asks the simple question: Are you alive? \
        [Learn more]({learnMoreLink}).',
            values: {
                learnMoreLink: '{config.docs.beats.heartbeat}/heartbeat-getting-started.html',
            },
        }),
        euiIconType: 'uptimeApp',
        artifacts: {
            dashboards: [],
            application: {
                path: '/app/uptime',
                label: i18n_1.i18n.translate('home.tutorials.uptimeMonitors.artifacts.dashboards.linkLabel', {
                    defaultMessage: 'Uptime App',
                }),
            },
            exportedFields: {
                documentationUrl: '{config.docs.beats.heartbeat}/exported-fields.html',
            },
        },
        completionTimeMinutes: 10,
        previewImagePath: '/plugins/kibana/home/tutorial_resources/uptime_monitors/screenshot.png',
        onPrem: heartbeat_instructions_1.onPremInstructions([], context),
        elasticCloud: heartbeat_instructions_1.cloudInstructions(),
        onPremElasticCloud: heartbeat_instructions_1.onPremCloudInstructions(),
    };
}
exports.uptimeMonitorsSpecProvider = uptimeMonitorsSpecProvider;
