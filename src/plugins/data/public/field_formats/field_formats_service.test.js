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
const field_formats_service_1 = require("./field_formats_service");
const mocks_1 = require("../../../../../src/core/public/mocks");
const date_1 = require("./converters/date");
describe('FieldFormatService', () => {
    test('DateFormat is public version', () => {
        const mockCore = mocks_1.coreMock.createSetup();
        const service = new field_formats_service_1.FieldFormatsService();
        service.setup(mockCore);
        const fieldFormatsRegistry = service.start();
        const DateFormatFromRegsitry = fieldFormatsRegistry.getTypeWithoutMetaParams('date');
        expect(DateFormatFromRegsitry).toEqual(date_1.DateFormat);
    });
});
