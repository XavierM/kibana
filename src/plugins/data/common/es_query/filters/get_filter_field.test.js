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
const phrase_filter_1 = require("./phrase_filter");
const query_string_filter_1 = require("./query_string_filter");
const get_filter_field_1 = require("./get_filter_field");
const fields_mocks_ts_1 = require("../../index_patterns/fields/fields.mocks.ts");
describe('getFilterField', function () {
    const indexPattern = {
        id: 'logstash-*',
        fields: fields_mocks_ts_1.fields,
    };
    it('should return the field name from known filter types that target a specific field', () => {
        const field = indexPattern.fields.find(patternField => patternField.name === 'extension');
        const filter = phrase_filter_1.buildPhraseFilter(field, 'jpg', indexPattern);
        const result = get_filter_field_1.getFilterField(filter);
        expect(result).toBe('extension');
    });
    it('should return undefined for filters that do not target a specific field', () => {
        const filter = query_string_filter_1.buildQueryFilter({
            query: {
                query_string: {
                    query: 'response:200 and extension:jpg',
                },
            },
        }, indexPattern.id, '');
        const result = get_filter_field_1.getFilterField(filter);
        expect(result).toBe(undefined);
    });
});
