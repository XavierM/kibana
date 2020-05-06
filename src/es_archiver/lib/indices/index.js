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
var create_index_stream_1 = require("./create_index_stream");
exports.createCreateIndexStream = create_index_stream_1.createCreateIndexStream;
var delete_index_stream_1 = require("./delete_index_stream");
exports.createDeleteIndexStream = delete_index_stream_1.createDeleteIndexStream;
var generate_index_records_stream_1 = require("./generate_index_records_stream");
exports.createGenerateIndexRecordsStream = generate_index_records_stream_1.createGenerateIndexRecordsStream;
var kibana_index_1 = require("./kibana_index");
exports.migrateKibanaIndex = kibana_index_1.migrateKibanaIndex;
exports.deleteKibanaIndices = kibana_index_1.deleteKibanaIndices;
exports.createDefaultSpace = kibana_index_1.createDefaultSpace;
