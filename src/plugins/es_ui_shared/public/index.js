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
var json_editor_1 = require("./components/json_editor");
exports.JsonEditor = json_editor_1.JsonEditor;
var section_loading_1 = require("./components/section_loading");
exports.SectionLoading = section_loading_1.SectionLoading;
var cron_editor_1 = require("./components/cron_editor");
exports.CronEditor = cron_editor_1.CronEditor;
exports.MINUTE = cron_editor_1.MINUTE;
exports.HOUR = cron_editor_1.HOUR;
exports.DAY = cron_editor_1.DAY;
exports.WEEK = cron_editor_1.WEEK;
exports.MONTH = cron_editor_1.MONTH;
exports.YEAR = cron_editor_1.YEAR;
var np_ready_request_1 = require("./request/np_ready_request");
exports.sendRequest = np_ready_request_1.sendRequest;
exports.useRequest = np_ready_request_1.useRequest;
var indices_1 = require("./indices");
exports.indices = indices_1.indices;
var use_ui_ace_keyboard_mode_1 = require("./use_ui_ace_keyboard_mode");
exports.useUIAceKeyboardMode = use_ui_ace_keyboard_mode_1.useUIAceKeyboardMode;
var console_lang_1 = require("./console_lang");
exports.installXJsonMode = console_lang_1.installXJsonMode;
exports.XJsonMode = console_lang_1.XJsonMode;
exports.ElasticsearchSqlHighlightRules = console_lang_1.ElasticsearchSqlHighlightRules;
exports.addXJsonToRules = console_lang_1.addXJsonToRules;
exports.ScriptHighlightRules = console_lang_1.ScriptHighlightRules;
exports.XJsonHighlightRules = console_lang_1.XJsonHighlightRules;
exports.collapseLiteralStrings = console_lang_1.collapseLiteralStrings;
exports.expandLiteralStrings = console_lang_1.expandLiteralStrings;
var authorization_1 = require("./authorization");
exports.AuthorizationContext = authorization_1.AuthorizationContext;
exports.AuthorizationProvider = authorization_1.AuthorizationProvider;
exports.NotAuthorizedSection = authorization_1.NotAuthorizedSection;
exports.WithPrivileges = authorization_1.WithPrivileges;
exports.SectionError = authorization_1.SectionError;
exports.useAuthorizationContext = authorization_1.useAuthorizationContext;
/** dummy plugin, we just want esUiShared to have its own bundle */
function plugin() {
    return new (class EsUiSharedPlugin {
        setup() { }
        start() { }
    })();
}
exports.plugin = plugin;
