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
var save_modal_1 = require("./save_modal");
exports.SavedObjectSaveModal = save_modal_1.SavedObjectSaveModal;
exports.showSaveModal = save_modal_1.showSaveModal;
var finder_1 = require("./finder");
exports.getSavedObjectFinder = finder_1.getSavedObjectFinder;
exports.SavedObjectFinderUi = finder_1.SavedObjectFinderUi;
var saved_object_1 = require("./saved_object");
exports.SavedObjectLoader = saved_object_1.SavedObjectLoader;
exports.createSavedObjectClass = saved_object_1.createSavedObjectClass;
exports.checkForDuplicateTitle = saved_object_1.checkForDuplicateTitle;
exports.saveWithConfirmation = saved_object_1.saveWithConfirmation;
exports.isErrorNonFatal = saved_object_1.isErrorNonFatal;
exports.plugin = () => new plugin_1.SavedObjectsPublicPlugin();
