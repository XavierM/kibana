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
const react_1 = tslib_1.__importDefault(require("react"));
const test_utils_1 = require("react-dom/test-utils");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const react_expression_renderer_1 = require("./react_expression_renderer");
const loader_1 = require("./loader");
const enzyme_1 = require("enzyme");
const eui_1 = require("@elastic/eui");
jest.mock('./loader', () => {
    return {
        ExpressionLoader: jest.fn().mockImplementation(() => {
            return {};
        }),
        loader: jest.fn(),
    };
});
describe('ExpressionRenderer', () => {
    it('starts to load, resolves, and goes back to loading', () => {
        const dataSubject = new rxjs_1.Subject();
        const data$ = dataSubject.asObservable().pipe(operators_1.share());
        const renderSubject = new rxjs_1.Subject();
        const render$ = renderSubject.asObservable().pipe(operators_1.share());
        const loadingSubject = new rxjs_1.Subject();
        const loading$ = loadingSubject.asObservable().pipe(operators_1.share());
        loader_1.ExpressionLoader.mockImplementation(() => {
            return {
                render$,
                data$,
                loading$,
                update: jest.fn(),
            };
        });
        const instance = enzyme_1.mount(react_1.default.createElement(react_expression_renderer_1.ReactExpressionRenderer, { expression: "" }));
        test_utils_1.act(() => {
            loadingSubject.next();
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(1);
        test_utils_1.act(() => {
            renderSubject.next(1);
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(0);
        instance.setProps({ expression: 'something new' });
        test_utils_1.act(() => {
            loadingSubject.next();
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(1);
        test_utils_1.act(() => {
            renderSubject.next(1);
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(0);
    });
    it('should display a custom error message if the user provides one and then remove it after successful render', () => {
        const dataSubject = new rxjs_1.Subject();
        const data$ = dataSubject.asObservable().pipe(operators_1.share());
        const renderSubject = new rxjs_1.Subject();
        const render$ = renderSubject.asObservable().pipe(operators_1.share());
        const loadingSubject = new rxjs_1.Subject();
        const loading$ = loadingSubject.asObservable().pipe(operators_1.share());
        let onRenderError;
        loader_1.ExpressionLoader.mockImplementation((...args) => {
            const params = args[2];
            onRenderError = params.onRenderError;
            return {
                render$,
                data$,
                loading$,
                update: jest.fn(),
            };
        });
        const instance = enzyme_1.mount(react_1.default.createElement(react_expression_renderer_1.ReactExpressionRenderer, { expression: "", renderError: message => react_1.default.createElement("div", { "data-test-subj": 'custom-error' }, message) }));
        test_utils_1.act(() => {
            onRenderError(instance.getDOMNode(), new Error('render error'), {
                done: () => {
                    renderSubject.next(1);
                },
            });
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(0);
        expect(instance.find('[data-test-subj="custom-error"]')).toHaveLength(1);
        expect(instance.find('[data-test-subj="custom-error"]').contains('render error')).toBeTruthy();
        test_utils_1.act(() => {
            loadingSubject.next();
            renderSubject.next(2);
        });
        instance.update();
        expect(instance.find(eui_1.EuiProgress)).toHaveLength(0);
        expect(instance.find('[data-test-subj="custom-error"]')).toHaveLength(0);
    });
});
