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
const table_helper_1 = require("./table_helper");
describe('arrayContainsObjects', () => {
    it(`returns false for an array of primitives`, () => {
        const actual = table_helper_1.arrayContainsObjects(['test', 'test']);
        expect(actual).toBeFalsy();
    });
    it(`returns true for an array of objects`, () => {
        const actual = table_helper_1.arrayContainsObjects([{}, {}]);
        expect(actual).toBeTruthy();
    });
    it(`returns true for an array of objects and primitves`, () => {
        const actual = table_helper_1.arrayContainsObjects([{}, 'sdf']);
        expect(actual).toBeTruthy();
    });
    it(`returns false for an array of null values`, () => {
        const actual = table_helper_1.arrayContainsObjects([null, null]);
        expect(actual).toBeFalsy();
    });
    it(`returns false if no array is given`, () => {
        const actual = table_helper_1.arrayContainsObjects([null, null]);
        expect(actual).toBeFalsy();
    });
});
