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
var common_1 = require("../common");
exports.calculateObjectHash = common_1.calculateObjectHash;
exports.defer = common_1.defer;
exports.Defer = common_1.Defer;
exports.of = common_1.of;
exports.url = common_1.url;
exports.createGetterSetter = common_1.createGetterSetter;
exports.defaultFeedbackMessage = common_1.defaultFeedbackMessage;
tslib_1.__exportStar(require("./core"), exports);
tslib_1.__exportStar(require("./errors"), exports);
tslib_1.__exportStar(require("./field_mapping"), exports);
tslib_1.__exportStar(require("./field_wildcard"), exports);
tslib_1.__exportStar(require("./parse"), exports);
tslib_1.__exportStar(require("./render_complete"), exports);
tslib_1.__exportStar(require("./resize_checker"), exports);
tslib_1.__exportStar(require("../common/state_containers"), exports);
tslib_1.__exportStar(require("./storage"), exports);
var hashed_item_store_1 = require("./storage/hashed_item_store");
exports.hashedItemStore = hashed_item_store_1.hashedItemStore;
exports.HashedItemStore = hashed_item_store_1.HashedItemStore;
var state_hash_1 = require("./state_management/state_hash");
exports.createStateHash = state_hash_1.createStateHash;
exports.persistState = state_hash_1.persistState;
exports.retrieveState = state_hash_1.retrieveState;
exports.isStateHash = state_hash_1.isStateHash;
var url_1 = require("./state_management/url");
exports.hashQuery = url_1.hashQuery;
exports.hashUrl = url_1.hashUrl;
exports.unhashUrl = url_1.unhashUrl;
exports.unhashQuery = url_1.unhashQuery;
exports.createUrlTracker = url_1.createUrlTracker;
exports.createKbnUrlTracker = url_1.createKbnUrlTracker;
exports.createKbnUrlControls = url_1.createKbnUrlControls;
exports.getStateFromKbnUrl = url_1.getStateFromKbnUrl;
exports.getStatesFromKbnUrl = url_1.getStatesFromKbnUrl;
exports.setStateToKbnUrl = url_1.setStateToKbnUrl;
var state_sync_1 = require("./state_sync");
exports.syncState = state_sync_1.syncState;
exports.syncStates = state_sync_1.syncStates;
exports.createKbnUrlStateStorage = state_sync_1.createKbnUrlStateStorage;
exports.createSessionStorageStateStorage = state_sync_1.createSessionStorageStateStorage;
var history_1 = require("./history");
exports.removeQueryParam = history_1.removeQueryParam;
exports.redirectWhenMissing = history_1.redirectWhenMissing;
var diff_object_1 = require("./state_management/utils/diff_object");
exports.applyDiff = diff_object_1.applyDiff;
/** dummy plugin, we just want kibanaUtils to have its own bundle */
function plugin() {
    return new (class KibanaUtilsPlugin {
        setup() { }
        start() { }
    })();
}
exports.plugin = plugin;
