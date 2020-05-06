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
const operators_1 = require("rxjs/operators");
const loader_1 = require("./loader");
const rxjs_1 = require("rxjs");
const common_1 = require("../common");
// eslint-disable-next-line
const { __getLastExecution } = require('./services');
const element = null;
jest.mock('./services', () => {
    const renderers = {
        test: {
            render: (el, value, handlers) => {
                handlers.done();
            },
        },
    };
    // eslint-disable-next-line
    const service = new (require('../common/service/expressions_services').ExpressionsService)();
    const moduleMock = {
        __execution: undefined,
        __getLastExecution: () => moduleMock.__execution,
        getInterpreter: () => {
            return {
                interpretAst: async (expression) => {
                    return { type: 'render', as: 'test' };
                },
            };
        },
        getRenderersRegistry: () => ({
            get: (id) => renderers[id],
        }),
        getNotifications: jest.fn(() => {
            return {
                toasts: {
                    addError: jest.fn(() => { }),
                },
            };
        }),
        getExpressionsService: () => service,
    };
    const execute = service.execute;
    service.execute = (...args) => {
        const execution = execute(...args);
        jest.spyOn(execution, 'getData');
        jest.spyOn(execution, 'cancel');
        moduleMock.__execution = execution;
        return execution;
    };
    return moduleMock;
});
describe('execute helper function', () => {
    it('returns ExpressionLoader instance', () => {
        const response = loader_1.loader(element, '', {});
        expect(response).toBeInstanceOf(loader_1.ExpressionLoader);
    });
});
describe('ExpressionLoader', () => {
    const expressionString = 'demodata';
    describe('constructor', () => {
        it('accepts expression string', () => {
            const expressionLoader = new loader_1.ExpressionLoader(element, expressionString, {});
            expect(expressionLoader.getExpression()).toEqual(expressionString);
        });
        it('accepts expression AST', () => {
            const expressionAST = common_1.parseExpression(expressionString);
            const expressionLoader = new loader_1.ExpressionLoader(element, expressionAST, {});
            expect(expressionLoader.getExpression()).toEqual(expressionString);
            expect(expressionLoader.getAst()).toEqual(expressionAST);
        });
        it('creates observables', () => {
            const expressionLoader = new loader_1.ExpressionLoader(element, expressionString, {});
            expect(expressionLoader.events$).toBeInstanceOf(rxjs_1.Observable);
            expect(expressionLoader.render$).toBeInstanceOf(rxjs_1.Observable);
            expect(expressionLoader.update$).toBeInstanceOf(rxjs_1.Observable);
            expect(expressionLoader.data$).toBeInstanceOf(rxjs_1.Observable);
        });
    });
    it('emits on $data when data is available', async () => {
        const expressionLoader = new loader_1.ExpressionLoader(element, 'var foo', { variables: { foo: 123 } });
        const response = await expressionLoader.data$.pipe(operators_1.first()).toPromise();
        expect(response).toBe(123);
    });
    it('emits on loading$ on initial load and on updates', async () => {
        const expressionLoader = new loader_1.ExpressionLoader(element, expressionString, {});
        const loadingPromise = expressionLoader.loading$.pipe(operators_1.toArray()).toPromise();
        expressionLoader.update('test');
        expressionLoader.update('');
        expressionLoader.update();
        expressionLoader.destroy();
        expect(await loadingPromise).toHaveLength(4);
    });
    it('emits on render$ when rendering is done', async () => {
        const expressionLoader = new loader_1.ExpressionLoader(element, expressionString, {});
        const response = await expressionLoader.render$.pipe(operators_1.first()).toPromise();
        expect(response).toBe(1);
    });
    it('allows updating configuration', async () => {
        const expressionLoader = new loader_1.ExpressionLoader(element, expressionString, {});
        let response = await expressionLoader.render$.pipe(operators_1.first()).toPromise();
        expect(response).toBe(1);
        expressionLoader.update('test');
        response = await expressionLoader.render$.pipe(operators_1.skip(1), operators_1.first()).toPromise();
        expect(response).toBe(2);
    });
    it('cancels the previous request when the expression is updated', () => {
        const expressionLoader = new loader_1.ExpressionLoader(element, 'var foo', {});
        const execution = __getLastExecution();
        jest.spyOn(execution, 'cancel');
        expect(execution.cancel).toHaveBeenCalledTimes(0);
        expressionLoader.update('var bar', {});
        expect(execution.cancel).toHaveBeenCalledTimes(1);
    });
    it('inspect() returns correct inspector adapters', () => {
        const expressionDataHandler = new loader_1.ExpressionLoader(element, expressionString, {});
        expect(expressionDataHandler.inspect()).toHaveProperty('data');
        expect(expressionDataHandler.inspect()).toHaveProperty('requests');
    });
});
