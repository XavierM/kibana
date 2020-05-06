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
const Rx = tslib_1.__importStar(require("rxjs"));
const subscribe_with_scope_1 = require("./subscribe_with_scope");
// eslint-disable-next-line prefer-const
let $rootScope;
class Scope {
    constructor() {
        this.$root = $rootScope;
        this.$apply = jest.fn((fn) => fn());
    }
}
$rootScope = new Scope();
afterEach(() => {
    jest.clearAllMocks();
});
it('subscribes to the passed observable, returns subscription', () => {
    const $scope = new Scope();
    const unsubSpy = jest.fn();
    const subSpy = jest.fn(() => unsubSpy);
    const observable = new Rx.Observable(subSpy);
    const subscription = subscribe_with_scope_1.subscribeWithScope($scope, observable);
    expect(subSpy).toHaveBeenCalledTimes(1);
    expect(unsubSpy).not.toHaveBeenCalled();
    subscription.unsubscribe();
    expect(subSpy).toHaveBeenCalledTimes(1);
    expect(unsubSpy).toHaveBeenCalledTimes(1);
});
it('calls observer.next() if already in a digest cycle, wraps in $scope.$apply if not', () => {
    const subject = new Rx.Subject();
    const nextSpy = jest.fn();
    const $scope = new Scope();
    subscribe_with_scope_1.subscribeWithScope($scope, subject, { next: nextSpy });
    subject.next();
    expect($scope.$apply).toHaveBeenCalledTimes(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
    jest.clearAllMocks();
    $rootScope.$$phase = '$digest';
    subject.next();
    expect($scope.$apply).not.toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);
});
it('reports fatalError if observer.next() throws', () => {
    const fatalError = jest.fn();
    const $scope = new Scope();
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.of(undefined), {
        next() {
            throw new Error('foo bar');
        },
    }, fatalError);
    expect(fatalError.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    [Error: foo bar],
  ],
]
`);
});
it('reports fatal error if observer.error is not defined and observable errors', () => {
    const fatalError = jest.fn();
    const $scope = new Scope();
    const error = new Error('foo');
    error.stack = `${error.message}\n---stack trace ---`;
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.throwError(error), undefined, fatalError);
    expect(fatalError.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    [Error: Uncaught error in subscribeWithScope(): foo
---stack trace ---],
  ],
]
`);
});
it('reports fatal error if observer.error throws', () => {
    const fatalError = jest.fn();
    const $scope = new Scope();
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.throwError(new Error('foo')), {
        error: () => {
            throw new Error('foo');
        },
    }, fatalError);
    expect(fatalError.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    [Error: foo],
  ],
]
`);
});
it('does not report fatal error if observer.error handles the error', () => {
    const fatalError = jest.fn();
    const $scope = new Scope();
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.throwError(new Error('foo')), {
        error: () => {
            // noop, swallow error
        },
    }, fatalError);
    expect(fatalError.mock.calls).toEqual([]);
});
it('reports fatal error if observer.complete throws', () => {
    const fatalError = jest.fn();
    const $scope = new Scope();
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.EMPTY, {
        complete: () => {
            throw new Error('foo');
        },
    }, fatalError);
    expect(fatalError.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    [Error: foo],
  ],
]
`);
});
it('preserves the context of the observer functions', () => {
    const $scope = new Scope();
    const observer = {
        next() {
            expect(this).toBe(observer);
        },
        complete() {
            expect(this).toBe(observer);
        },
    };
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.of([1, 2, 3]), observer);
    const observer2 = {
        error() {
            expect(this).toBe(observer);
        },
    };
    subscribe_with_scope_1.subscribeWithScope($scope, Rx.throwError(new Error('foo')), observer2);
});
