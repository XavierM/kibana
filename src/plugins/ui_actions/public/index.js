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
function plugin(initializerContext) {
    return new plugin_1.UiActionsPlugin(initializerContext);
}
exports.plugin = plugin;
var service_1 = require("./service");
exports.UiActionsService = service_1.UiActionsService;
var actions_1 = require("./actions");
exports.createAction = actions_1.createAction;
exports.IncompatibleActionError = actions_1.IncompatibleActionError;
var context_menu_1 = require("./context_menu");
exports.buildContextMenuForActions = context_menu_1.buildContextMenuForActions;
var triggers_1 = require("./triggers");
exports.SELECT_RANGE_TRIGGER = triggers_1.SELECT_RANGE_TRIGGER;
exports.selectRangeTrigger = triggers_1.selectRangeTrigger;
exports.VALUE_CLICK_TRIGGER = triggers_1.VALUE_CLICK_TRIGGER;
exports.valueClickTrigger = triggers_1.valueClickTrigger;
exports.APPLY_FILTER_TRIGGER = triggers_1.APPLY_FILTER_TRIGGER;
exports.applyFilterTrigger = triggers_1.applyFilterTrigger;
