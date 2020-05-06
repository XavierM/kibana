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
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./code_editor"), exports);
tslib_1.__exportStar(require("./exit_full_screen_button"), exports);
tslib_1.__exportStar(require("./context"), exports);
tslib_1.__exportStar(require("./overlays"), exports);
tslib_1.__exportStar(require("./ui_settings"), exports);
tslib_1.__exportStar(require("./field_icon"), exports);
tslib_1.__exportStar(require("./table_list_view"), exports);
tslib_1.__exportStar(require("./split_panel"), exports);
var validated_range_1 = require("./validated_range");
exports.ValidatedDualRange = validated_range_1.ValidatedDualRange;
tslib_1.__exportStar(require("./notifications"), exports);
var markdown_1 = require("./markdown");
exports.Markdown = markdown_1.Markdown;
exports.MarkdownSimple = markdown_1.MarkdownSimple;
var adapters_1 = require("./adapters");
exports.reactToUiComponent = adapters_1.reactToUiComponent;
exports.uiToReactComponent = adapters_1.uiToReactComponent;
var use_url_tracker_1 = require("./use_url_tracker");
exports.useUrlTracker = use_url_tracker_1.useUrlTracker;
var util_1 = require("./util");
exports.toMountPoint = util_1.toMountPoint;
/** dummy plugin, we just want kibanaReact to have its own bundle */
function plugin() {
    return new (class KibanaReactPlugin {
        setup() { }
        start() { }
    })();
}
exports.plugin = plugin;
