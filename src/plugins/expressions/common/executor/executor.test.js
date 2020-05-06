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
const executor_1 = require("./executor");
const expressionTypes = tslib_1.__importStar(require("../expression_types"));
const expressionFunctions = tslib_1.__importStar(require("../expression_functions"));
const execution_1 = require("../execution");
const ast_1 = require("../ast");
describe('Executor', () => {
    test('can instantiate', () => {
        new executor_1.Executor();
    });
    describe('type registry', () => {
        test('can register a type', () => {
            const executor = new executor_1.Executor();
            executor.registerType(expressionTypes.datatable);
        });
        test('can register all types', () => {
            const executor = new executor_1.Executor();
            for (const type of expressionTypes.typeSpecs)
                executor.registerType(type);
        });
        test('can retrieve all types', () => {
            const executor = new executor_1.Executor();
            executor.registerType(expressionTypes.datatable);
            const types = executor.getTypes();
            expect(Object.keys(types)).toEqual(['datatable']);
        });
        test('can retrieve all types - 2', () => {
            const executor = new executor_1.Executor();
            for (const type of expressionTypes.typeSpecs)
                executor.registerType(type);
            const types = executor.getTypes();
            expect(Object.keys(types).sort()).toEqual(expressionTypes.typeSpecs.map(spec => spec.name).sort());
        });
    });
    describe('function registry', () => {
        test('can register a function', () => {
            const executor = new executor_1.Executor();
            executor.registerFunction(expressionFunctions.clog);
        });
        test('can register all functions', () => {
            const executor = new executor_1.Executor();
            for (const functionDefinition of expressionFunctions.functionSpecs)
                executor.registerFunction(functionDefinition);
        });
        test('can retrieve all functions', () => {
            const executor = new executor_1.Executor();
            executor.registerFunction(expressionFunctions.clog);
            const functions = executor.getFunctions();
            expect(Object.keys(functions)).toEqual(['clog']);
        });
        test('can retrieve all functions - 2', () => {
            const executor = new executor_1.Executor();
            for (const functionDefinition of expressionFunctions.functionSpecs)
                executor.registerFunction(functionDefinition);
            const functions = executor.getFunctions();
            expect(Object.keys(functions).sort()).toEqual(expressionFunctions.functionSpecs.map(spec => spec.name).sort());
        });
    });
    describe('context', () => {
        test('context is empty by default', () => {
            const executor = new executor_1.Executor();
            expect(executor.context).toEqual({});
        });
        test('can extend context', () => {
            const executor = new executor_1.Executor();
            executor.extendContext({
                foo: 'bar',
            });
            expect(executor.context).toEqual({
                foo: 'bar',
            });
        });
        test('can extend context multiple times with multiple keys', () => {
            const executor = new executor_1.Executor();
            const abortSignal = {};
            const env = {};
            executor.extendContext({
                foo: 'bar',
            });
            executor.extendContext({
                abortSignal,
                env,
            });
            expect(executor.context).toEqual({
                foo: 'bar',
                abortSignal,
                env,
            });
        });
    });
    describe('execution', () => {
        describe('createExecution()', () => {
            test('returns Execution object from string', () => {
                const executor = new executor_1.Executor();
                const execution = executor.createExecution('foo bar="baz"');
                expect(execution).toBeInstanceOf(execution_1.Execution);
                expect(execution.state.get().ast.chain[0].function).toBe('foo');
            });
            test('returns Execution object from AST', () => {
                const executor = new executor_1.Executor();
                const ast = ast_1.parseExpression('foo bar="baz"');
                const execution = executor.createExecution(ast);
                expect(execution).toBeInstanceOf(execution_1.Execution);
                expect(execution.state.get().ast.chain[0].function).toBe('foo');
            });
            test('Execution inherits context from Executor', () => {
                const executor = new executor_1.Executor();
                const foo = {};
                executor.extendContext({ foo });
                const execution = executor.createExecution('foo bar="baz"');
                expect(execution.context.foo).toBe(foo);
            });
        });
    });
});
