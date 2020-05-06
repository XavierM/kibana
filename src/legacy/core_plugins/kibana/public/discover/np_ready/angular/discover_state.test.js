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
const discover_state_1 = require("./discover_state");
const history_1 = require("history");
let history;
let state;
const getCurrentUrl = () => history.createHref(history.location);
describe('Test discover state', () => {
    beforeEach(async () => {
        history = history_1.createBrowserHistory();
        history.push('/');
        state = discover_state_1.getState({
            defaultAppState: { index: 'test' },
            history,
        });
        await state.replaceUrlAppState({});
        await state.startSync();
    });
    afterEach(() => {
        state.stopSync();
    });
    test('setting app state and syncing to URL', async () => {
        state.setAppState({ index: 'modified' });
        state.flushToUrl();
        expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_a=(index:modified)"`);
    });
    test('changing URL to be propagated to appState', async () => {
        history.push('/#?_a=(index:modified)');
        expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "modified",
      }
    `);
    });
    test('URL navigation to url without _a, state should not change', async () => {
        history.push('/#?_a=(index:modified)');
        history.push('/');
        expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "modified",
      }
    `);
    });
    test('isAppStateDirty returns  whether the current state has changed', async () => {
        state.setAppState({ index: 'modified' });
        expect(state.isAppStateDirty()).toBeTruthy();
        state.resetInitialAppState();
        expect(state.isAppStateDirty()).toBeFalsy();
    });
    test('getPreviousAppState returns the state before the current', async () => {
        state.setAppState({ index: 'first' });
        const stateA = state.appStateContainer.getState();
        state.setAppState({ index: 'second' });
        expect(state.getPreviousAppState()).toEqual(stateA);
    });
});
describe('Test discover state with legacy migration', () => {
    test('migration of legacy query ', async () => {
        history = history_1.createBrowserHistory();
        history.push("/#?_a=(query:(query_string:(analyze_wildcard:!t,query:'type:nice%20name:%22yeah%22')))");
        state = discover_state_1.getState({
            defaultAppState: { index: 'test' },
            history,
        });
        expect(state.appStateContainer.getState()).toMatchInlineSnapshot(`
      Object {
        "index": "test",
        "query": Object {
          "language": "lucene",
          "query": Object {
            "query_string": Object {
              "analyze_wildcard": true,
              "query": "type:nice name:\\"yeah\\"",
            },
          },
        },
      }
    `);
    });
});
