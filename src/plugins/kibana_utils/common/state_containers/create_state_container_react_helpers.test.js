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
const React = tslib_1.__importStar(require("react"));
const ReactDOM = tslib_1.__importStar(require("react-dom"));
const test_utils_1 = require("react-dom/test-utils");
const create_state_container_1 = require("./create_state_container");
const create_state_container_react_helpers_1 = require("./create_state_container_react_helpers");
let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});
afterEach(() => {
    document.body.removeChild(container);
    container = null;
});
test('can create React context', () => {
    const context = create_state_container_react_helpers_1.createStateContainerReactHelpers();
    expect(context).toMatchObject({
        Provider: expect.any(Object),
        Consumer: expect.any(Object),
        connect: expect.any(Function),
        context: expect.any(Object),
    });
});
test('<Provider> passes state to <Consumer>', () => {
    const stateContainer = create_state_container_1.createStateContainer({ hello: 'world' });
    const { Provider, Consumer } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
    ReactDOM.render(React.createElement(Provider, { value: stateContainer },
        React.createElement(Consumer, null, (s) => s.get().hello)), container);
    expect(container.innerHTML).toBe('world');
});
test('<Provider> passes state to connect()()', () => {
    const stateContainer = create_state_container_1.createStateContainer({ hello: 'Bob' });
    const { Provider, connect } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
    const Demo = ({ message, stop }) => (React.createElement(React.Fragment, null,
        message,
        stop));
    const mergeProps = ({ hello }) => ({ message: hello });
    const DemoConnected = connect(mergeProps)(Demo);
    ReactDOM.render(React.createElement(Provider, { value: stateContainer },
        React.createElement(DemoConnected, { stop: "?" })), container);
    expect(container.innerHTML).toBe('Bob?');
});
test('context receives stateContainer', () => {
    const stateContainer = create_state_container_1.createStateContainer({ foo: 'bar' });
    const { Provider, context } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
    ReactDOM.render(
    /* eslint-disable no-shadow */
    React.createElement(Provider, { value: stateContainer },
        React.createElement(context.Consumer, null, stateContainer => stateContainer.get().foo)), 
    /* eslint-enable no-shadow */
    container);
    expect(container.innerHTML).toBe('bar');
});
test.todo('can use multiple stores in one React app');
describe('hooks', () => {
    describe('useStore', () => {
        test('can select store using useContainer hook', () => {
            const stateContainer = create_state_container_1.createStateContainer({ foo: 'bar' });
            const { Provider, useContainer } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                // eslint-disable-next-line no-shadow
                const stateContainer = useContainer();
                return React.createElement(React.Fragment, null, stateContainer.get().foo);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.innerHTML).toBe('bar');
        });
    });
    describe('useState', () => {
        test('can select state using useState hook', () => {
            const stateContainer = create_state_container_1.createStateContainer({ foo: 'qux' });
            const { Provider, useState } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                const { foo } = useState();
                return React.createElement(React.Fragment, null, foo);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.innerHTML).toBe('qux');
        });
        test('re-renders when state changes', () => {
            const stateContainer = create_state_container_1.createStateContainer({ foo: 'bar' }, {
                setFoo: (state) => (foo) => ({ ...state, foo }),
            });
            const { Provider, useState } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                const { foo } = useState();
                return React.createElement(React.Fragment, null, foo);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.innerHTML).toBe('bar');
            test_utils_1.act(() => {
                stateContainer.transitions.setFoo('baz');
            });
            expect(container.innerHTML).toBe('baz');
        });
    });
    describe('useTransitions', () => {
        test('useTransitions hook returns mutations that can update state', () => {
            const stateContainer = create_state_container_1.createStateContainer({
                cnt: 0,
            }, {
                increment: (state) => (value) => ({
                    ...state,
                    cnt: state.cnt + value,
                }),
            });
            const { Provider, useState, useTransitions } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                const { cnt } = useState();
                const { increment } = useTransitions();
                return (React.createElement(React.Fragment, null,
                    React.createElement("strong", null, cnt),
                    React.createElement("button", { onClick: () => increment(10) }, "Increment")));
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.querySelector('strong').innerHTML).toBe('0');
            test_utils_1.act(() => {
                test_utils_1.Simulate.click(container.querySelector('button'), {});
            });
            expect(container.querySelector('strong').innerHTML).toBe('10');
            test_utils_1.act(() => {
                test_utils_1.Simulate.click(container.querySelector('button'), {});
            });
            expect(container.querySelector('strong').innerHTML).toBe('20');
        });
    });
    describe('useSelector', () => {
        test('can select deeply nested value', () => {
            const stateContainer = create_state_container_1.createStateContainer({
                foo: {
                    bar: {
                        baz: 'qux',
                    },
                },
            });
            const selector = (state) => state.foo.bar.baz;
            const { Provider, useSelector } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                const value = useSelector(selector);
                return React.createElement(React.Fragment, null, value);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.innerHTML).toBe('qux');
        });
        test('re-renders when state changes', () => {
            const stateContainer = create_state_container_1.createStateContainer({
                foo: {
                    bar: {
                        baz: 'qux',
                    },
                },
            });
            const selector = (state) => state.foo.bar.baz;
            const { Provider, useSelector } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            const Demo = () => {
                const value = useSelector(selector);
                return React.createElement(React.Fragment, null, value);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            expect(container.innerHTML).toBe('qux');
            test_utils_1.act(() => {
                stateContainer.set({
                    foo: {
                        bar: {
                            baz: 'quux',
                        },
                    },
                });
            });
            expect(container.innerHTML).toBe('quux');
        });
        test("re-renders only when selector's result changes", async () => {
            const stateContainer = create_state_container_1.createStateContainer({ a: 'b', foo: 'bar' });
            const selector = (state) => state.foo;
            const { Provider, useSelector } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            let cnt = 0;
            const Demo = () => {
                cnt++;
                const value = useSelector(selector);
                return React.createElement(React.Fragment, null, value);
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
            test_utils_1.act(() => {
                stateContainer.set({ a: 'c', foo: 'bar' });
            });
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
            test_utils_1.act(() => {
                stateContainer.set({ a: 'd', foo: 'bar 2' });
            });
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(2);
        });
        test('does not re-render on same shape object', async () => {
            const stateContainer = create_state_container_1.createStateContainer({ foo: { bar: 'baz' } });
            const selector = (state) => state.foo;
            const { Provider, useSelector } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            let cnt = 0;
            const Demo = () => {
                cnt++;
                const value = useSelector(selector);
                return React.createElement(React.Fragment, null, JSON.stringify(value));
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
            test_utils_1.act(() => {
                stateContainer.set({ foo: { bar: 'baz' } });
            });
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
            test_utils_1.act(() => {
                stateContainer.set({ foo: { bar: 'qux' } });
            });
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(2);
        });
        test('can set custom comparator function to prevent re-renders on deep equality', async () => {
            const stateContainer = create_state_container_1.createStateContainer({ foo: { bar: 'baz' } }, {
                set: () => (newState) => newState,
            });
            const selector = (state) => state.foo;
            const comparator = (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr);
            const { Provider, useSelector } = create_state_container_react_helpers_1.createStateContainerReactHelpers();
            let cnt = 0;
            const Demo = () => {
                cnt++;
                const value = useSelector(selector, comparator);
                return React.createElement(React.Fragment, null, JSON.stringify(value));
            };
            ReactDOM.render(React.createElement(Provider, { value: stateContainer },
                React.createElement(Demo, null)), container);
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
            test_utils_1.act(() => {
                stateContainer.set({ foo: { bar: 'baz' } });
            });
            await new Promise(r => setTimeout(r, 1));
            expect(cnt).toBe(1);
        });
        test.todo('unsubscribes when React un-mounts');
    });
});
