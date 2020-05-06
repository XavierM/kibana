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
const tslib_1 = require("tslib");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const get_aria_name_1 = require("./get_aria_name");
describe('Settings', function () {
    describe('Advanced', function () {
        describe('getAriaName(name)', function () {
            it('should return a space delimited lower-case string with no special characters', function () {
                expect_1.default(get_aria_name_1.getAriaName('xPack:defaultAdminEmail')).to.be('x pack default admin email');
                expect_1.default(get_aria_name_1.getAriaName('doc_table:highlight')).to.be('doc table highlight');
                expect_1.default(get_aria_name_1.getAriaName('foo')).to.be('foo');
            });
            it('should return an empty string if passed undefined or null', function () {
                expect_1.default(get_aria_name_1.getAriaName()).to.be('');
                expect_1.default(get_aria_name_1.getAriaName(undefined)).to.be('');
            });
        });
    });
});
