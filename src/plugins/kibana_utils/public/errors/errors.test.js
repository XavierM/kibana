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
const errors_1 = require("./errors");
describe('errors', () => {
    const errors = [new errors_1.DuplicateField('dupfield'), new errors_1.SavedObjectNotFound('dashboard', '123')];
    errors.forEach(error => {
        const className = error.constructor.name;
        it(`${className} has a message`, () => {
            expect_1.default(error.message).to.not.be.empty();
        });
        it(`${className} has a stack trace`, () => {
            expect_1.default(error.stack).to.not.be.empty();
        });
        it(`${className} is an instance of KbnError`, () => {
            expect_1.default(error instanceof errors_1.KbnError).to.be(true);
        });
    });
});
