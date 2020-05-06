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
const on_prem_1 = require("./on_prem");
const elastic_cloud_1 = require("./elastic_cloud");
const on_prem_elastic_cloud_1 = require("./on_prem_elastic_cloud");
function netflowSpecProvider() {
    return {
        id: 'netflow',
        name: 'Netflow',
        category: tutorials_1.TutorialsCategory.SIEM,
        shortDescription: i18n_1.i18n.translate('home.tutorials.netflow.tutorialShortDescription', {
            defaultMessage: 'Collect Netflow records sent by a Netflow exporter.',
        }),
        longDescription: i18n_1.i18n.translate('home.tutorials.netflow.tutorialLongDescription', {
            defaultMessage: 'The Logstash Netflow module collects and parses network flow data, \
indexes the events into Elasticsearch, and installs a suite of Kibana dashboards. \
This module support Netflow Version 5 and 9. [Learn more]({linkUrl}).',
            values: {
                linkUrl: '{config.docs.logstash}/netflow-module.html',
            },
        }),
        completionTimeMinutes: 10,
        // previewImagePath: 'kibana-apache.png', TODO
        onPrem: on_prem_1.createOnPremInstructions(),
        elasticCloud: elastic_cloud_1.createElasticCloudInstructions(),
        onPremElasticCloud: on_prem_elastic_cloud_1.createOnPremElasticCloudInstructions(),
    };
}
exports.netflowSpecProvider = netflowSpecProvider;
