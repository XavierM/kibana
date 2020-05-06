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
require("./index.scss");
const plugin_1 = require("./plugin");
function plugin(initializerContext) {
    return new plugin_1.VisualizationsPlugin(initializerContext);
}
exports.plugin = plugin;
/** @public static code */
var vis_1 = require("./vis");
exports.Vis = vis_1.Vis;
var types_service_1 = require("./vis_types/types_service");
exports.TypesService = types_service_1.TypesService;
var embeddable_1 = require("./embeddable");
exports.VISUALIZE_EMBEDDABLE_TYPE = embeddable_1.VISUALIZE_EMBEDDABLE_TYPE;
exports.VIS_EVENT_TO_TRIGGER = embeddable_1.VIS_EVENT_TO_TRIGGER;
// @ts-ignore
var vis_update_state_1 = require("./legacy/vis_update_state");
exports.updateOldState = vis_update_state_1.updateOldState;
var persisted_state_1 = require("./persisted_state");
exports.PersistedState = persisted_state_1.PersistedState;
