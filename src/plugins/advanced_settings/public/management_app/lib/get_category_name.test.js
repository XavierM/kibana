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
const get_category_name_1 = require("./get_category_name");
describe('Settings', function () {
    describe('Advanced', function () {
        describe('getCategoryName(category)', function () {
            it('should capitalize unknown category', function () {
                expect_1.default(get_category_name_1.getCategoryName('elasticsearch')).to.be('Elasticsearch');
            });
            it('should return empty string for no category', function () {
                expect_1.default(get_category_name_1.getCategoryName()).to.be('');
                expect_1.default(get_category_name_1.getCategoryName('')).to.be('');
            });
        });
    });
});
