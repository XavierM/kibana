"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
// @ts-ignore
const utils_string_collapsing_txt_1 = tslib_1.__importDefault(require("./utils_string_collapsing.txt"));
// @ts-ignore
const utils_string_expanding_txt_1 = tslib_1.__importDefault(require("./utils_string_expanding.txt"));
const utils = tslib_1.__importStar(require("../index"));
describe('JSON to XJSON conversion tools', () => {
    it('will collapse multiline strings', () => {
        const multiline = '{ "foo": """bar\nbaz""" }';
        expect(utils.collapseLiteralStrings(multiline)).toEqual('{ "foo": "bar\\nbaz" }');
    });
    it('will collapse multiline strings with CRLF endings', () => {
        const multiline = '{ "foo": """bar\r\nbaz""" }';
        expect(utils.collapseLiteralStrings(multiline)).toEqual('{ "foo": "bar\\r\\nbaz" }');
    });
});
lodash_1.default.each(utils_string_collapsing_txt_1.default.split(/^=+$/m), function (fixture) {
    if (fixture.trim() === '') {
        return;
    }
    fixture = fixture.split(/^-+$/m);
    const name = fixture[0].trim();
    const expanded = fixture[1].trim();
    const collapsed = fixture[2].trim();
    test('Literal collapse - ' + name, function () {
        expect(utils.collapseLiteralStrings(expanded)).toEqual(collapsed);
    });
});
lodash_1.default.each(utils_string_expanding_txt_1.default.split(/^=+$/m), function (fixture) {
    if (fixture.trim() === '') {
        return;
    }
    fixture = fixture.split(/^-+$/m);
    const name = fixture[0].trim();
    const collapsed = fixture[1].trim();
    const expanded = fixture[2].trim();
    test('Literal expand - ' + name, function () {
        expect(utils.expandLiteralStrings(collapsed)).toEqual(expanded);
    });
});
