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
const execution_1 = require("./execution");
const ast_1 = require("../ast");
const test_helpers_1 = require("../test_helpers");
jest.useFakeTimers();
beforeEach(() => {
    jest.clearAllTimers();
});
const createExecution = (expression = 'foo bar=123', context = {}, debug = false) => {
    const executor = test_helpers_1.createUnitTestExecutor();
    const execution = new execution_1.Execution({
        executor,
        ast: ast_1.parseExpression(expression),
        context,
        debug,
    });
    return execution;
};
describe('Execution abortion tests', () => {
    test('can abort an expression immediately', async () => {
        const execution = createExecution('sleep 10');
        execution.start();
        execution.cancel();
        const result = await execution.result;
        expect(result).toMatchObject({
            type: 'error',
            error: {
                message: 'The expression was aborted.',
                name: 'AbortError',
            },
        });
    });
    test('can abort an expression which has function running mid flight', async () => {
        const execution = createExecution('sleep 300');
        execution.start();
        jest.advanceTimersByTime(100);
        execution.cancel();
        const result = await execution.result;
        expect(result).toMatchObject({
            type: 'error',
            error: {
                message: 'The expression was aborted.',
                name: 'AbortError',
            },
        });
    });
    test('cancelling execution after it completed has no effect', async () => {
        jest.useRealTimers();
        const execution = createExecution('sleep 1');
        execution.start();
        const result = await execution.result;
        execution.cancel();
        expect(result).toBe(null);
        jest.useFakeTimers();
    });
});
