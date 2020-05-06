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
const plugin_1 = require("./plugin");
var application_1 = require("./application");
exports.DashboardContainer = application_1.DashboardContainer;
exports.DashboardContainerFactory = application_1.DashboardContainerFactory;
exports.DASHBOARD_CONTAINER_TYPE = application_1.DASHBOARD_CONTAINER_TYPE;
// Types below here can likely be made private when dashboard app moved into this NP plugin.
exports.DEFAULT_PANEL_WIDTH = application_1.DEFAULT_PANEL_WIDTH;
exports.DEFAULT_PANEL_HEIGHT = application_1.DEFAULT_PANEL_HEIGHT;
var dashboard_constants_1 = require("./dashboard_constants");
exports.DashboardConstants = dashboard_constants_1.DashboardConstants;
exports.createDashboardEditUrl = dashboard_constants_1.createDashboardEditUrl;
var url_generator_1 = require("./url_generator");
exports.DASHBOARD_APP_URL_GENERATOR = url_generator_1.DASHBOARD_APP_URL_GENERATOR;
function plugin(initializerContext) {
    return new plugin_1.DashboardPlugin(initializerContext);
}
exports.plugin = plugin;
