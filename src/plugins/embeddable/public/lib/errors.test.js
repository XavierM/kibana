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
const public_1 = require("src/plugins/ui_actions/public");
const errors_1 = require("./errors");
describe('IncompatibleActionError', () => {
    test('is instance of error', () => {
        const error = new public_1.IncompatibleActionError();
        expect(error).toBeInstanceOf(Error);
    });
    test('has INCOMPATIBLE_ACTION code', () => {
        const error = new public_1.IncompatibleActionError();
        expect(error.code).toBe('INCOMPATIBLE_ACTION');
    });
});
describe('PanelNotFoundError', () => {
    test('is instance of error', () => {
        const error = new errors_1.PanelNotFoundError();
        expect(error).toBeInstanceOf(Error);
    });
    test('has PANEL_NOT_FOUND code', () => {
        const error = new errors_1.PanelNotFoundError();
        expect(error.code).toBe('PANEL_NOT_FOUND');
    });
});
describe('EmbeddableFactoryNotFoundError', () => {
    test('is instance of error', () => {
        const error = new errors_1.EmbeddableFactoryNotFoundError('type1');
        expect(error).toBeInstanceOf(Error);
    });
    test('has EMBEDDABLE_FACTORY_NOT_FOUND code', () => {
        const error = new errors_1.EmbeddableFactoryNotFoundError('type1');
        expect(error.code).toBe('EMBEDDABLE_FACTORY_NOT_FOUND');
    });
});
