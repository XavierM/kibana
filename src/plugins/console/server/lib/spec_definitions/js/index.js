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
const aggregations_1 = require("./aggregations");
const aliases_1 = require("./aliases");
const document_1 = require("./document");
const filter_1 = require("./filter");
const globals_1 = require("./globals");
const ingest_1 = require("./ingest");
const mappings_1 = require("./mappings");
const settings_1 = require("./settings");
const query_1 = require("./query");
const reindex_1 = require("./reindex");
const search_1 = require("./search");
exports.jsSpecLoaders = [
    aggregations_1.aggs,
    aliases_1.aliases,
    document_1.document,
    filter_1.filter,
    globals_1.globals,
    ingest_1.ingest,
    mappings_1.mappings,
    settings_1.settings,
    query_1.query,
    reindex_1.reindex,
    search_1.search,
];
