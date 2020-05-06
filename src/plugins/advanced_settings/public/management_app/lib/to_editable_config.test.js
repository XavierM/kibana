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
const to_editable_config_1 = require("./to_editable_config");
const defDefault = {
    isOverridden: true,
};
function invoke({ def = defDefault, name = 'woah', value = 'forreal', }) {
    return to_editable_config_1.toEditableConfig({ def, name, value, isCustom: def === defDefault, isOverridden: true });
}
describe('Settings', function () {
    describe('Advanced', function () {
        describe('toEditableConfig(def, name, value)', function () {
            it('sets name', function () {
                expect_1.default(invoke({ name: 'who' }).name).to.equal('who');
            });
            it('sets value', function () {
                expect_1.default(invoke({ value: 'what' }).value).to.equal('what');
            });
            it('sets type', function () {
                expect_1.default(invoke({ value: 'what' }).type).to.be('string');
                expect_1.default(invoke({ value: 0 }).type).to.be('number');
                expect_1.default(invoke({ value: [] }).type).to.be('array');
            });
            describe('when given a setting definition object', function () {
                let def;
                beforeEach(function () {
                    def = {
                        value: 'the original',
                        description: 'the one and only',
                        options: ['all the options'],
                    };
                });
                it('is not marked as custom', function () {
                    expect_1.default(invoke({ def }).isCustom).to.be(false);
                });
                it('sets a default value', function () {
                    expect_1.default(invoke({ def }).defVal).to.equal(def.value);
                });
                it('sets a description', function () {
                    expect_1.default(invoke({ def }).description).to.equal(def.description);
                });
                it('sets options', function () {
                    expect_1.default(invoke({ def }).options).to.equal(def.options);
                });
                describe('that contains a type', function () {
                    it('sets that type', function () {
                        def.type = 'string';
                        expect_1.default(invoke({ def }).type).to.equal(def.type);
                    });
                });
                describe('that contains a value of type array', function () {
                    it('sets type to array', function () {
                        def.value = [];
                        expect_1.default(invoke({ def }).type).to.equal('array');
                    });
                });
                describe('that contains a validation object', function () {
                    it('constructs a validation regex with message', function () {
                        def.validation = {
                            regexString: '^foo',
                            message: 'must start with "foo"',
                        };
                        const result = invoke({ def });
                        const validationTyped = result.validation;
                        expect_1.default(validationTyped.regex).to.be.a(RegExp);
                        expect_1.default(validationTyped.message).to.equal('must start with "foo"');
                    });
                });
            });
            describe('when not given a setting definition object', function () {
                it('is marked as custom', function () {
                    expect_1.default(invoke({}).isCustom).to.be(true);
                });
                it('sets defVal to undefined', function () {
                    expect_1.default(invoke({}).defVal).to.be(undefined);
                });
                it('sets description to undefined', function () {
                    expect_1.default(invoke({}).description).to.be(undefined);
                });
                it('sets options to undefined', function () {
                    expect_1.default(invoke({}).options).to.be(undefined);
                });
                it('sets validation to undefined', function () {
                    expect_1.default(invoke({}).validation).to.be(undefined);
                });
            });
        });
    });
});
