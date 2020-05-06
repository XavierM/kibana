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
var save_1 = require("./save");
exports.saveAction = save_1.saveAction;
var load_1 = require("./load");
exports.loadAction = load_1.loadAction;
var unload_1 = require("./unload");
exports.unloadAction = unload_1.unloadAction;
var rebuild_all_1 = require("./rebuild_all");
exports.rebuildAllAction = rebuild_all_1.rebuildAllAction;
var empty_kibana_index_1 = require("./empty_kibana_index");
exports.emptyKibanaIndexAction = empty_kibana_index_1.emptyKibanaIndexAction;
var edit_1 = require("./edit");
exports.editAction = edit_1.editAction;
