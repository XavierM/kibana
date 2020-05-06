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
const exists_filter_1 = require("./exists_filter");
const fields_mocks_ts_1 = require("../../index_patterns/fields/fields.mocks.ts");
describe('exists filter', function () {
    const indexPattern = {
        fields: fields_mocks_ts_1.fields,
    };
    describe('getExistsFilterField', function () {
        it('should return the name of the field an exists query is targeting', () => {
            const field = indexPattern.fields.find(patternField => patternField.name === 'extension');
            const filter = exists_filter_1.buildExistsFilter(field, indexPattern);
            const result = exists_filter_1.getExistsFilterField(filter);
            expect(result).toBe('extension');
        });
    });
});
