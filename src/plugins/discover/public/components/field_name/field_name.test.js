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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const field_name_1 = require("./field_name");
jest.mock('ui/new_platform');
// Note that it currently provides just 2 basic tests, there should be more, but
// the components involved will soon change
test('FieldName renders a string field by providing fieldType and fieldName', () => {
    const component = enzyme_1.render(react_1.default.createElement(field_name_1.FieldName, { fieldType: "string", fieldName: "test" }));
    expect(component).toMatchSnapshot();
});
test('FieldName renders a number field by providing a field record, useShortDots is set to false', () => {
    const component = enzyme_1.render(react_1.default.createElement(field_name_1.FieldName, { fieldName: 'test.test.test', fieldType: 'number' }));
    expect(component).toMatchSnapshot();
});
test('FieldName renders a geo field, useShortDots is set to true', () => {
    const component = enzyme_1.render(react_1.default.createElement(field_name_1.FieldName, { fieldName: 'test.test.test', fieldType: 'geo_point', useShortDots: true }));
    expect(component).toMatchSnapshot();
});
