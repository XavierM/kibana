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
var project_1 = require("./project");
exports.Project = project_1.Project;
var projects_1 = require("./projects");
exports.filterProjectsByFlag = projects_1.filterProjectsByFlag;
var get_ts_project_for_absolute_path_1 = require("./get_ts_project_for_absolute_path");
exports.getTsProjectForAbsolutePath = get_ts_project_for_absolute_path_1.getTsProjectForAbsolutePath;
var exec_in_projects_1 = require("./exec_in_projects");
exports.execInProjects = exec_in_projects_1.execInProjects;
var run_type_check_cli_1 = require("./run_type_check_cli");
exports.runTypeCheckCli = run_type_check_cli_1.runTypeCheckCli;
