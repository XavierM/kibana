"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const new_platform_1 = require("ui/new_platform");
// @ts-ignore
const modules_1 = require("ui/modules");
const public_1 = require("../../../../../plugins/saved_objects/public");
const _saved_sheet_1 = require("./_saved_sheet");
const module = modules_1.uiModules.get('app/sheet');
const savedObjectsClient = new_platform_1.npStart.core.savedObjects.client;
const services = {
    savedObjectsClient,
    indexPatterns: new_platform_1.npStart.plugins.data.indexPatterns,
    search: new_platform_1.npStart.plugins.data.search,
    chrome: new_platform_1.npStart.core.chrome,
    overlays: new_platform_1.npStart.core.overlays,
};
const SavedSheet = _saved_sheet_1.createSavedSheetClass(services, new_platform_1.npStart.core.uiSettings);
exports.savedSheetLoader = new public_1.SavedObjectLoader(SavedSheet, savedObjectsClient, new_platform_1.npStart.core.chrome);
exports.savedSheetLoader.urlFor = id => `#/${encodeURIComponent(id)}`;
// Customize loader properties since adding an 's' on type doesn't work for type 'timelion-sheet'.
exports.savedSheetLoader.loaderProperties = {
    name: 'timelion-sheet',
    noun: 'Saved Sheets',
    nouns: 'saved sheets',
};
// This is the only thing that gets injected into controllers
module.service('savedSheets', () => exports.savedSheetLoader);
