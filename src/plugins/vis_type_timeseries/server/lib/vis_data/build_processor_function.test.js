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
const build_processor_function_1 = require("./build_processor_function");
describe('buildProcessorFunction(chain, ...args)', () => {
    const req = {};
    const panel = {};
    const series = {};
    test('should call each processor', () => {
        const first = jest.fn(() => (next) => (doc) => next(doc));
        const second = jest.fn(() => (next) => (doc) => next(doc));
        build_processor_function_1.buildProcessorFunction([first, second], req, panel, series);
        expect(first.mock.calls.length).toEqual(1);
        expect(second.mock.calls.length).toEqual(1);
    });
    test('should chain each processor', () => {
        const first = jest.fn(() => (next) => (doc) => next(doc));
        const second = jest.fn(() => (next) => (doc) => next(doc));
        build_processor_function_1.buildProcessorFunction([() => first, () => second], req, panel, series);
        expect(first.mock.calls.length).toEqual(1);
        expect(second.mock.calls.length).toEqual(1);
    });
    test('should next of each processor', () => {
        const first = jest.fn();
        const second = jest.fn();
        const fn = build_processor_function_1.buildProcessorFunction([
            () => (next) => (doc) => {
                first();
                next(doc);
            },
            () => (next) => (doc) => {
                second();
                next(doc);
            },
        ], req, panel, series);
        fn({});
        expect(first.mock.calls.length).toEqual(1);
        expect(second.mock.calls.length).toEqual(1);
    });
});
