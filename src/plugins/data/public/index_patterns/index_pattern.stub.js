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
const field_stub_1 = require("./field.stub");
exports.stubIndexPattern = {
    id: 'logstash-*',
    fields: field_stub_1.stubFields,
    title: 'logstash-*',
    timeFieldName: '@timestamp',
};
exports.stubIndexPatternWithFields = {
    id: '1234',
    title: 'logstash-*',
    fields: [
        {
            name: 'response',
            type: 'number',
            esTypes: ['integer'],
            aggregatable: true,
            filterable: true,
            searchable: true,
        },
    ],
};
