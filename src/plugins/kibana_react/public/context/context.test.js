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
const context_1 = require("./context");
const mocks_1 = require("../../../../core/public/mocks");
let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});
afterEach(() => {
    document.body.removeChild(container);
    container = null;
});
test('can mount <Provider> without crashing', () => {
    const services = mocks_1.coreMock.createStart();
    ReactDOM.render(React.createElement(context_1.context.Provider, { value: { services } },
        React.createElement("div", null, "Hello world")), container);
});
const TestConsumer = () => {
    const { services } = context_1.useKibana();
    return React.createElement("div", null, services.foo);
};
test('useKibana() hook retrieves Kibana context', () => {
    const core = mocks_1.coreMock.createStart();
    core.foo = 'bar';
    ReactDOM.render(React.createElement(context_1.context.Provider, { value: { services: core } },
        React.createElement(TestConsumer, null)), container);
    const div = container.querySelector('div');
    expect(div.textContent).toBe('bar');
});
test('createContext() creates context that can be consumed by useKibana() hook', () => {
    const services = {
        foo: 'baz',
    };
    const { Provider } = context_1.createKibanaReactContext(services);
    ReactDOM.render(React.createElement(Provider, null,
        React.createElement(TestConsumer, null)), container);
    const div = container.querySelector('div');
    expect(div.textContent).toBe('baz');
});
test('services, notifications and overlays objects are always available', () => {
    const { Provider } = context_1.createKibanaReactContext({});
    const Test = () => {
        const kibana = context_1.useKibana();
        expect(kibana).toMatchObject({
            services: expect.any(Object),
            notifications: expect.any(Object),
            overlays: expect.any(Object),
        });
        return null;
    };
    ReactDOM.render(React.createElement(Provider, null,
        React.createElement(Test, null)), container);
});
test('<KibanaContextProvider> provider provides default kibana-react context', () => {
    const Test = () => {
        const kibana = context_1.useKibana();
        expect(kibana).toMatchObject({
            services: expect.any(Object),
            notifications: expect.any(Object),
            overlays: expect.any(Object),
        });
        return null;
    };
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, null,
        React.createElement(Test, null)), container);
});
test('<KibanaContextProvider> can set custom services in context', () => {
    const Test = () => {
        const { services } = context_1.useKibana();
        expect(services.test).toBe('quux');
        return null;
    };
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, { services: { test: 'quux' } },
        React.createElement(Test, null)), container);
});
test('nested <KibanaContextProvider> override and merge services', () => {
    const Test = () => {
        const { services } = context_1.useKibana();
        expect(services.foo).toBe('foo2');
        expect(services.bar).toBe('bar');
        expect(services.baz).toBe('baz3');
        return null;
    };
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, { services: { foo: 'foo', bar: 'bar', baz: 'baz' } },
        React.createElement(context_1.KibanaContextProvider, { services: { foo: 'foo2' } },
            React.createElement(context_1.KibanaContextProvider, { services: { baz: 'baz3' } },
                React.createElement(Test, null)))), container);
});
test('overlays wrapper uses the closest overlays service', () => {
    const Test = () => {
        const { overlays } = context_1.useKibana();
        overlays.openFlyout({});
        overlays.openModal({});
        return null;
    };
    const core1 = {
        overlays: mocks_1.overlayServiceMock.createStartContract(),
    };
    const core2 = {
        overlays: mocks_1.overlayServiceMock.createStartContract(),
    };
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, { services: core1 },
        React.createElement(context_1.KibanaContextProvider, { services: core2 },
            React.createElement(Test, null))), container);
    expect(core1.overlays.openFlyout).toHaveBeenCalledTimes(0);
    expect(core1.overlays.openModal).toHaveBeenCalledTimes(0);
    expect(core2.overlays.openFlyout).toHaveBeenCalledTimes(1);
    expect(core2.overlays.openModal).toHaveBeenCalledTimes(1);
});
test('notifications wrapper uses the closest notifications service', () => {
    const Test = () => {
        const { notifications } = context_1.useKibana();
        notifications.toasts.show({});
        return null;
    };
    const core1 = {
        notifications: {
            toasts: {
                add: jest.fn(),
            },
        },
    };
    const core2 = {
        notifications: {
            toasts: {
                add: jest.fn(),
            },
        },
    };
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, { services: core1 },
        React.createElement(context_1.KibanaContextProvider, { services: core2 },
            React.createElement(Test, null))), container);
    expect(core1.notifications.toasts.add).toHaveBeenCalledTimes(0);
    expect(core2.notifications.toasts.add).toHaveBeenCalledTimes(1);
});
test('overlays wrapper uses available overlays service, higher up in <KibanaContextProvider> tree', () => {
    const Test = () => {
        const { overlays } = context_1.useKibana();
        overlays.openFlyout({});
        return null;
    };
    const core1 = {
        overlays: mocks_1.overlayServiceMock.createStartContract(),
        notifications: {
            toasts: {
                add: jest.fn(),
            },
        },
    };
    const core2 = {
        notifications: {
            toasts: {
                add: jest.fn(),
            },
        },
    };
    expect(core1.overlays.openFlyout).toHaveBeenCalledTimes(0);
    ReactDOM.render(React.createElement(context_1.KibanaContextProvider, { services: core1 },
        React.createElement(context_1.KibanaContextProvider, { services: core2 },
            React.createElement(Test, null))), container);
    expect(core1.overlays.openFlyout).toHaveBeenCalledTimes(1);
});
