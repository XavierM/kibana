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
const table_vis_controller_js_1 = require("./table_vis_controller.js");
// @ts-ignore
const agg_table_1 = require("./agg_table/agg_table");
// @ts-ignore
const agg_table_group_1 = require("./agg_table/agg_table_group");
// @ts-ignore
const rows_1 = require("./paginated_table/rows");
// @ts-ignore
const paginated_table_1 = require("./paginated_table/paginated_table");
/** @internal */
exports.initTableVisLegacyModule = (angularIns) => {
    angularIns
        .controller('KbnTableVisController', table_vis_controller_js_1.TableVisController)
        .directive('kbnAggTable', agg_table_1.KbnAggTable)
        .directive('kbnAggTableGroup', agg_table_group_1.KbnAggTableGroup)
        .directive('kbnRows', rows_1.KbnRows)
        .directive('paginatedTable', paginated_table_1.PaginatedTable);
};
