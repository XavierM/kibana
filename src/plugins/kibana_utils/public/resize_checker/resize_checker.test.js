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
const resize_checker_1 = require("./resize_checker");
const events_1 = require("events");
// If you want to know why these mocks are created,
// please check: https://github.com/elastic/kibana/pull/44750
jest.mock('resize-observer-polyfill');
const resize_observer_polyfill_1 = tslib_1.__importDefault(require("resize-observer-polyfill"));
class MockElement {
    constructor() {
        this.clientHeight = 0;
        this.clientWidth = 0;
        this.onResize = null;
    }
    addEventListener(name, listener) {
        this.onResize = listener;
    }
    dispatchEvent(name) {
        if (this.onResize) {
            this.onResize();
        }
    }
    removeEventListener(name, listener) {
        this.onResize = null;
    }
}
resize_observer_polyfill_1.default.mockImplementation(function (callback) {
    this.observe = function (el) {
        el.addEventListener('resize', callback);
    };
    this.disconnect = function () { };
    this.unobserve = function (el) {
        el.removeEventListener('resize', callback);
    };
});
describe('Resize Checker', () => {
    describe('events', () => {
        it('is an event emitter', () => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el);
            expect(checker).toBeInstanceOf(events_1.EventEmitter);
        });
        it('emits a "resize" event', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el);
            const listener = jest.fn();
            checker.on('resize', listener);
            el.clientHeight = 100;
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener.mock.calls.length).toBe(1);
                done();
            }, 100);
        });
    });
    describe('enable/disabled state', () => {
        it('should not trigger events while disabled', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            expect(listener).not.toBeCalled();
            el.clientHeight = 100;
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener).not.toBeCalled();
                done();
            }, 100);
        });
        it('should trigger resize events after calling enable', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            expect(listener).not.toBeCalled();
            checker.enable();
            el.clientHeight = 100;
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener).toBeCalled();
                done();
            }, 100);
        });
        it('should not trigger the first time after enable when the size does not change', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            expect(listener).not.toBeCalled();
            el.clientHeight = 100;
            checker.enable();
            el.clientHeight = 100;
            setTimeout(() => {
                expect(listener).not.toBeCalled();
                done();
            }, 100);
        });
    });
    describe('#modifySizeWithoutTriggeringResize()', () => {
        it(`does not emit "resize" events caused by the block`, done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            checker.modifySizeWithoutTriggeringResize(() => {
                el.clientHeight = 100;
            });
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener).not.toBeCalled();
                done();
            }, 1000);
        });
        it('does emit "resize" when modification is made between the block and resize notification', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            checker.modifySizeWithoutTriggeringResize(() => {
                el.clientHeight = 100;
            });
            el.dispatchEvent('resize');
            expect(listener).not.toBeCalled();
            el.clientHeight = 200;
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener).not.toBeCalled();
                done();
            }, 100);
        });
    });
    describe('#destroy()', () => {
        it('destroys internal observer instance', () => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            checker.destroy();
            expect(!checker.observer).toBe(true);
        });
        it('does not emit future resize events', done => {
            const el = new MockElement();
            const checker = new resize_checker_1.ResizeChecker(el, { disabled: true });
            const listener = jest.fn();
            checker.on('resize', listener);
            checker.destroy();
            el.clientHeight = 100;
            el.dispatchEvent('resize');
            setTimeout(() => {
                expect(listener).not.toBeCalled();
                done();
            }, 100);
        });
    });
});
