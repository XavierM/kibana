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
const state_containers_1 = require("../../common/state_containers");
const todomvc_1 = require("../../demos/state_containers/todomvc");
const state_sync_1 = require("./state_sync");
const rxjs_1 = require("rxjs");
const state_sync_state_storage_1 = require("./state_sync_state_storage");
const stub_browser_storage_1 = require("test_utils/stub_browser_storage");
const history_1 = require("history");
describe('state_sync', () => {
    describe('basic', () => {
        const container = state_containers_1.createStateContainer(todomvc_1.defaultState, todomvc_1.pureTransitions);
        beforeEach(() => {
            container.set(todomvc_1.defaultState);
        });
        const storageChange$ = new rxjs_1.Subject();
        let testStateStorage;
        beforeEach(() => {
            testStateStorage = {
                set: jest.fn(),
                get: jest.fn(),
                change$: (key) => storageChange$.asObservable(),
            };
        });
        it('should sync state to storage', () => {
            const key = '_s';
            const { start, stop } = state_sync_1.syncState({
                stateContainer: withDefaultState(container, todomvc_1.defaultState),
                storageKey: key,
                stateStorage: testStateStorage,
            });
            start();
            // initial sync of state to storage is not happening
            expect(testStateStorage.set).not.toBeCalled();
            container.transitions.add({
                id: 1,
                text: 'Learning transitions...',
                completed: false,
            });
            expect(testStateStorage.set).toBeCalledWith(key, container.getState());
            stop();
        });
        it('should sync storage to state', () => {
            const key = '_s';
            const storageState1 = [{ id: 1, text: 'todo', completed: false }];
            testStateStorage.get.mockImplementation(() => storageState1);
            const { stop, start } = state_sync_1.syncState({
                stateContainer: withDefaultState(container, todomvc_1.defaultState),
                storageKey: key,
                stateStorage: testStateStorage,
            });
            start();
            // initial sync of storage to state is not happening
            expect(container.getState()).toEqual(todomvc_1.defaultState);
            const storageState2 = { todos: [{ id: 1, text: 'todo', completed: true }] };
            testStateStorage.get.mockImplementation(() => storageState2);
            storageChange$.next(storageState2);
            expect(container.getState()).toEqual(storageState2);
            stop();
        });
        it('should not update storage if no actual state change happened', () => {
            const key = '_s';
            const { stop, start } = state_sync_1.syncState({
                stateContainer: withDefaultState(container, todomvc_1.defaultState),
                storageKey: key,
                stateStorage: testStateStorage,
            });
            start();
            testStateStorage.set.mockClear();
            container.set(todomvc_1.defaultState);
            expect(testStateStorage.set).not.toBeCalled();
            stop();
        });
        it('should not update state container if no actual storage change happened', () => {
            const key = '_s';
            const { stop, start } = state_sync_1.syncState({
                stateContainer: withDefaultState(container, todomvc_1.defaultState),
                storageKey: key,
                stateStorage: testStateStorage,
            });
            start();
            const originalState = container.getState();
            const storageState = { ...originalState };
            testStateStorage.get.mockImplementation(() => storageState);
            storageChange$.next(storageState);
            expect(container.getState()).toBe(originalState);
            stop();
        });
        it('storage change to null should notify state', () => {
            container.set({ todos: [{ completed: false, id: 1, text: 'changed' }] });
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: '_s',
                    stateStorage: testStateStorage,
                },
            ]);
            start();
            testStateStorage.get.mockImplementation(() => null);
            storageChange$.next(null);
            expect(container.getState()).toEqual(todomvc_1.defaultState);
            stop();
        });
        it('storage change with incomplete or differently shaped object should notify state and set new object as is', () => {
            container.set({ todos: [{ completed: false, id: 1, text: 'changed' }] });
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: container,
                    storageKey: '_s',
                    stateStorage: testStateStorage,
                },
            ]);
            start();
            const differentlyShapedObject = {
                different: 'test',
            };
            testStateStorage.get.mockImplementation(() => differentlyShapedObject);
            storageChange$.next(differentlyShapedObject);
            expect(container.getState()).toStrictEqual(differentlyShapedObject);
            stop();
        });
    });
    describe('integration', () => {
        const key = '_s';
        const container = state_containers_1.createStateContainer(todomvc_1.defaultState, todomvc_1.pureTransitions);
        let sessionStorage;
        let sessionStorageSyncStrategy;
        let history;
        let urlSyncStrategy;
        const getCurrentUrl = () => history.createHref(history.location);
        const tick = () => new Promise(resolve => setTimeout(resolve));
        beforeEach(() => {
            container.set(todomvc_1.defaultState);
            window.location.href = '/';
            sessionStorage = new stub_browser_storage_1.StubBrowserStorage();
            sessionStorageSyncStrategy = state_sync_state_storage_1.createSessionStorageStateStorage(sessionStorage);
            history = history_1.createBrowserHistory();
            urlSyncStrategy = state_sync_state_storage_1.createKbnUrlStateStorage({ useHash: false, history });
        });
        it('change to one storage should also update other storage', () => {
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: urlSyncStrategy,
                },
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: sessionStorageSyncStrategy,
                },
            ]);
            start();
            const newStateFromUrl = { todos: [{ completed: false, id: 1, text: 'changed' }] };
            history.replace('/#?_s=(todos:!((completed:!f,id:1,text:changed)))');
            expect(container.getState()).toEqual(newStateFromUrl);
            expect(JSON.parse(sessionStorage.getItem(key))).toEqual(newStateFromUrl);
            stop();
        });
        it('KbnUrlSyncStrategy applies url updates asynchronously to trigger single history change', async () => {
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: urlSyncStrategy,
                },
            ]);
            start();
            const startHistoryLength = history.length;
            container.transitions.add({ id: 2, text: '2', completed: false });
            container.transitions.add({ id: 3, text: '3', completed: false });
            container.transitions.completeAll();
            expect(history.length).toBe(startHistoryLength);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/"`);
            await tick();
            expect(history.length).toBe(startHistoryLength + 1);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_s=(todos:!((completed:!t,id:0,text:'Learning%20state%20containers'),(completed:!t,id:2,text:'2'),(completed:!t,id:3,text:'3')))"`);
            stop();
        });
        it('KbnUrlSyncStrategy supports flushing url updates synchronously and triggers single history change', async () => {
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: urlSyncStrategy,
                },
            ]);
            start();
            const startHistoryLength = history.length;
            container.transitions.add({ id: 2, text: '2', completed: false });
            container.transitions.add({ id: 3, text: '3', completed: false });
            container.transitions.completeAll();
            expect(history.length).toBe(startHistoryLength);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/"`);
            urlSyncStrategy.flush();
            expect(history.length).toBe(startHistoryLength + 1);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_s=(todos:!((completed:!t,id:0,text:'Learning%20state%20containers'),(completed:!t,id:2,text:'2'),(completed:!t,id:3,text:'3')))"`);
            await tick();
            expect(history.length).toBe(startHistoryLength + 1);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_s=(todos:!((completed:!t,id:0,text:'Learning%20state%20containers'),(completed:!t,id:2,text:'2'),(completed:!t,id:3,text:'3')))"`);
            stop();
        });
        it('KbnUrlSyncStrategy supports cancellation of pending updates ', async () => {
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: urlSyncStrategy,
                },
            ]);
            start();
            const startHistoryLength = history.length;
            container.transitions.add({ id: 2, text: '2', completed: false });
            container.transitions.add({ id: 3, text: '3', completed: false });
            container.transitions.completeAll();
            expect(history.length).toBe(startHistoryLength);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/"`);
            urlSyncStrategy.cancel();
            expect(history.length).toBe(startHistoryLength);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/"`);
            await tick();
            expect(history.length).toBe(startHistoryLength);
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/"`);
            stop();
        });
        it("should preserve reference to unchanged state slices if them didn't change", async () => {
            const otherUnchangedSlice = { a: 'test' };
            const oldState = {
                todos: container.get().todos,
                otherUnchangedSlice,
            };
            container.set(oldState);
            const { stop, start } = state_sync_1.syncStates([
                {
                    stateContainer: withDefaultState(container, todomvc_1.defaultState),
                    storageKey: key,
                    stateStorage: urlSyncStrategy,
                },
            ]);
            await urlSyncStrategy.set('_s', container.get());
            expect(getCurrentUrl()).toMatchInlineSnapshot(`"/#?_s=(otherUnchangedSlice:(a:test),todos:!((completed:!f,id:0,text:'Learning%20state%20containers')))"`);
            start();
            history.replace("/#?_s=(otherUnchangedSlice:(a:test),todos:!((completed:!t,id:0,text:'Learning%20state%20containers')))");
            const newState = container.get();
            expect(newState.todos).toEqual([
                { id: 0, text: 'Learning state containers', completed: true },
            ]);
            // reference to unchanged slice is preserved
            expect(newState.otherUnchangedSlice).toBe(otherUnchangedSlice);
            stop();
        });
    });
});
function withDefaultState(stateContainer, 
// eslint-disable-next-line no-shadow
defaultState) {
    return {
        ...stateContainer,
        set: (state) => {
            stateContainer.set({
                ...defaultState,
                ...state,
            });
        },
    };
}
