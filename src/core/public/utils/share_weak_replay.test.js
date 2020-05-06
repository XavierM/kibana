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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const share_weak_replay_1 = require("./share_weak_replay");
let completedCounts = 0;
function counter({ async = true } = {}) {
    let subCounter = 0;
    function sendCount(subscriber) {
        let notifCounter = 0;
        const sub = ++subCounter;
        while (!subscriber.closed) {
            subscriber.next(`${sub}:${++notifCounter}`);
        }
        completedCounts += 1;
    }
    return new Rx.Observable(subscriber => {
        if (!async) {
            sendCount(subscriber);
            return;
        }
        const id = setTimeout(() => sendCount(subscriber));
        return () => clearTimeout(id);
    });
}
async function record(observable) {
    return observable
        .pipe(operators_1.materialize(), operators_1.map(n => (n.kind === 'N' ? `N:${n.value}` : n.kind === 'E' ? `E:${n.error.message}` : 'C')), operators_1.toArray())
        .toPromise();
}
afterEach(() => {
    completedCounts = 0;
});
it('multicasts an observable to multiple children, unsubs once all children do, and resubscribes on next subscription', async () => {
    const shared = counter().pipe(share_weak_replay_1.shareWeakReplay(1));
    await expect(Promise.all([record(shared.pipe(operators_1.take(1))), record(shared.pipe(operators_1.take(2)))])).resolves
        .toMatchInlineSnapshot(`
Array [
  Array [
    "N:1:1",
    "C",
  ],
  Array [
    "N:1:1",
    "N:1:2",
    "C",
  ],
]
`);
    await expect(Promise.all([record(shared.pipe(operators_1.take(3))), record(shared.pipe(operators_1.take(4)))])).resolves
        .toMatchInlineSnapshot(`
Array [
  Array [
    "N:2:1",
    "N:2:2",
    "N:2:3",
    "C",
  ],
  Array [
    "N:2:1",
    "N:2:2",
    "N:2:3",
    "N:2:4",
    "C",
  ],
]
`);
    expect(completedCounts).toBe(2);
});
it('resubscribes if parent errors', async () => {
    let errorCounter = 0;
    const shared = counter().pipe(operators_1.map((v, i) => {
        if (i === 3) {
            throw new Error(`error ${++errorCounter}`);
        }
        return v;
    }), share_weak_replay_1.shareWeakReplay(2));
    await expect(Promise.all([record(shared), record(shared)])).resolves.toMatchInlineSnapshot(`
Array [
  Array [
    "N:1:1",
    "N:1:2",
    "N:1:3",
    "E:error 1",
  ],
  Array [
    "N:1:1",
    "N:1:2",
    "N:1:3",
    "E:error 1",
  ],
]
`);
    await expect(Promise.all([record(shared), record(shared)])).resolves.toMatchInlineSnapshot(`
Array [
  Array [
    "N:2:1",
    "N:2:2",
    "N:2:3",
    "E:error 2",
  ],
  Array [
    "N:2:1",
    "N:2:2",
    "N:2:3",
    "E:error 2",
  ],
]
`);
    expect(completedCounts).toBe(2);
});
it('resubscribes if parent completes', async () => {
    const shared = counter().pipe(operators_1.take(4), share_weak_replay_1.shareWeakReplay(4));
    await expect(Promise.all([record(shared.pipe(operators_1.take(1))), record(shared)])).resolves
        .toMatchInlineSnapshot(`
Array [
  Array [
    "N:1:1",
    "C",
  ],
  Array [
    "N:1:1",
    "N:1:2",
    "N:1:3",
    "N:1:4",
    "C",
  ],
]
`);
    await expect(Promise.all([record(shared.pipe(operators_1.take(2))), record(shared)])).resolves
        .toMatchInlineSnapshot(`
Array [
  Array [
    "N:2:1",
    "N:2:2",
    "C",
  ],
  Array [
    "N:2:1",
    "N:2:2",
    "N:2:3",
    "N:2:4",
    "C",
  ],
]
`);
    expect(completedCounts).toBe(2);
});
it('supports parents that complete synchronously', async () => {
    const next = jest.fn();
    const complete = jest.fn();
    const shared = counter({ async: false }).pipe(operators_1.take(3), share_weak_replay_1.shareWeakReplay(1));
    shared.subscribe({ next, complete });
    expect(next.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "1:1",
  ],
  Array [
    "1:2",
  ],
  Array [
    "1:3",
  ],
]
`);
    expect(complete).toHaveBeenCalledTimes(1);
    next.mockClear();
    complete.mockClear();
    shared.subscribe({ next, complete });
    expect(next.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "2:1",
  ],
  Array [
    "2:2",
  ],
  Array [
    "2:3",
  ],
]
`);
    expect(complete).toHaveBeenCalledTimes(1);
    expect(completedCounts).toBe(2);
});
