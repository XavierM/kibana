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
const query_string_1 = require("query-string");
const public_1 = require("../../../../../dashboard/public");
const public_2 = require("../../../../../visualizations/public");
/** *
 * Returns relative dashboard URL with added embeddableType and embeddableId query params
 * eg.
 * input: url: lol/app/kibana#/dashboard?_g=(refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now)), embeddableId: 12345
 * output: /dashboard?addEmbeddableType=visualization&addEmbeddableId=12345&_g=(refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))
 * @param url dasbhoard absolute url
 * @param embeddableId id of the saved visualization
 */
function addEmbeddableToDashboardUrl(dashboardUrl, embeddableId) {
    const { url, query } = query_string_1.parseUrl(dashboardUrl);
    const [, dashboardId] = url.split(public_1.DashboardConstants.CREATE_NEW_DASHBOARD_URL);
    query[public_1.DashboardConstants.ADD_EMBEDDABLE_TYPE] = public_2.VISUALIZE_EMBEDDABLE_TYPE;
    query[public_1.DashboardConstants.ADD_EMBEDDABLE_ID] = embeddableId;
    return `${public_1.DashboardConstants.CREATE_NEW_DASHBOARD_URL}${dashboardId}?${query_string_1.stringify(query)}`;
}
exports.addEmbeddableToDashboardUrl = addEmbeddableToDashboardUrl;
