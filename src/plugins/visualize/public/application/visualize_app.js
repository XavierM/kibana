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
// @ts-ignore
const editor_1 = require("./editor/editor");
// @ts-ignore
const visualize_listing_1 = require("./listing/visualize_listing");
function initVisualizeAppDirective(app, deps) {
    editor_1.initEditorDirective(app, deps);
    visualize_listing_1.initListingDirective(app, deps.I18nContext);
}
exports.initVisualizeAppDirective = initVisualizeAppDirective;
