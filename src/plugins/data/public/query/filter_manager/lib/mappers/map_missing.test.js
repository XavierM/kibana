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
const map_missing_1 = require("./map_missing");
const common_1 = require("../../../../../common");
describe('filter manager utilities', () => {
    describe('mapMissing()', () => {
        test('should return the key and value for matching filters', async () => {
            const filter = {
                missing: { field: '_type' },
                ...common_1.buildEmptyFilter(true),
            };
            const result = map_missing_1.mapMissing(filter);
            expect(result).toHaveProperty('key', '_type');
            expect(result).toHaveProperty('value', 'missing');
        });
        test('should return undefined for none matching', async (done) => {
            const filter = common_1.buildEmptyFilter(true);
            try {
                map_missing_1.mapMissing(filter);
            }
            catch (e) {
                expect(e).toBe(filter);
                done();
            }
        });
    });
});
