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
const rxjs_1 = require("rxjs");
const distinct_until_changed_with_initial_value_1 = require("./distinct_until_changed_with_initial_value");
const operators_1 = require("rxjs/operators");
const fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
describe('distinctUntilChangedWithInitialValue', () => {
    it('should skip updates with the same value', async () => {
        const subject = new rxjs_1.Subject();
        const result = subject.pipe(distinct_until_changed_with_initial_value_1.distinctUntilChangedWithInitialValue(1), operators_1.toArray()).toPromise();
        subject.next(2);
        subject.next(3);
        subject.next(3);
        subject.next(3);
        subject.complete();
        expect(await result).toEqual([2, 3]);
    });
    it('should accept promise as initial value', async () => {
        const subject = new rxjs_1.Subject();
        const result = subject
            .pipe(distinct_until_changed_with_initial_value_1.distinctUntilChangedWithInitialValue(new Promise(resolve => {
            resolve(1);
            setTimeout(() => {
                subject.next(2);
                subject.next(3);
                subject.next(3);
                subject.next(3);
                subject.complete();
            });
        })), operators_1.toArray())
            .toPromise();
        expect(await result).toEqual([2, 3]);
    });
    it('should accept custom comparator', async () => {
        const subject = new rxjs_1.Subject();
        const result = subject
            .pipe(distinct_until_changed_with_initial_value_1.distinctUntilChangedWithInitialValue({ test: 1 }, fast_deep_equal_1.default), operators_1.toArray())
            .toPromise();
        subject.next({ test: 1 });
        subject.next({ test: 2 });
        subject.next({ test: 2 });
        subject.next({ test: 3 });
        subject.complete();
        expect(await result).toEqual([{ test: 2 }, { test: 3 }]);
    });
});
