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
tslib_1.__exportStar(require("./service"), exports);
var schema_1 = require("./schema");
exports.SavedObjectsSchema = schema_1.SavedObjectsSchema;
tslib_1.__exportStar(require("./import"), exports);
var export_1 = require("./export");
exports.exportSavedObjectsToStream = export_1.exportSavedObjectsToStream;
var serialization_1 = require("./serialization");
exports.SavedObjectsSerializer = serialization_1.SavedObjectsSerializer;
var saved_objects_service_1 = require("./saved_objects_service");
exports.SavedObjectsService = saved_objects_service_1.SavedObjectsService;
var saved_objects_config_1 = require("./saved_objects_config");
exports.savedObjectsConfig = saved_objects_config_1.savedObjectsConfig;
exports.savedObjectsMigrationConfig = saved_objects_config_1.savedObjectsMigrationConfig;
var saved_objects_type_registry_1 = require("./saved_objects_type_registry");
exports.SavedObjectTypeRegistry = saved_objects_type_registry_1.SavedObjectTypeRegistry;
