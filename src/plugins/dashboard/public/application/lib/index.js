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
var save_dashboard_1 = require("./save_dashboard");
exports.saveDashboard = save_dashboard_1.saveDashboard;
var get_app_state_defaults_1 = require("./get_app_state_defaults");
exports.getAppStateDefaults = get_app_state_defaults_1.getAppStateDefaults;
var migrate_app_state_1 = require("./migrate_app_state");
exports.migrateAppState = migrate_app_state_1.migrateAppState;
var url_1 = require("./url");
exports.getDashboardIdFromUrl = url_1.getDashboardIdFromUrl;
