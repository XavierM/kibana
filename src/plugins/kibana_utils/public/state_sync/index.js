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
var state_sync_state_storage_1 = require("./state_sync_state_storage");
exports.createSessionStorageStateStorage = state_sync_state_storage_1.createSessionStorageStateStorage;
exports.createKbnUrlStateStorage = state_sync_state_storage_1.createKbnUrlStateStorage;
var state_sync_1 = require("./state_sync");
exports.syncState = state_sync_1.syncState;
exports.syncStates = state_sync_1.syncStates;
