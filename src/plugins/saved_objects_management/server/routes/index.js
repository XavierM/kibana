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
const find_1 = require("./find");
const scroll_count_1 = require("./scroll_count");
const scroll_export_1 = require("./scroll_export");
const relationships_1 = require("./relationships");
const get_allowed_types_1 = require("./get_allowed_types");
function registerRoutes({ http, managementServicePromise }) {
    const router = http.createRouter();
    find_1.registerFindRoute(router, managementServicePromise);
    scroll_count_1.registerScrollForCountRoute(router);
    scroll_export_1.registerScrollForExportRoute(router);
    relationships_1.registerRelationshipsRoute(router, managementServicePromise);
    get_allowed_types_1.registerGetAllowedTypesRoute(router);
}
exports.registerRoutes = registerRoutes;
