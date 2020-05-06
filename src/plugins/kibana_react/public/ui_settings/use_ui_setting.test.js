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
const use_ui_setting_1 = require("./use_ui_setting");
const context_1 = require("../context");
const rxjs_1 = require("rxjs");
const mocks_1 = require("../../../../core/public/mocks");
const useObservable_1 = tslib_1.__importDefault(require("react-use/lib/useObservable"));
jest.mock('react-use/lib/useObservable');
const useObservableSpy = useObservable_1.default;
useObservableSpy.mockImplementation((observable, def) => def);
const mock = () => {
    const core = mocks_1.coreMock.createStart();
    const get = core.uiSettings.get;
    const get$ = core.uiSettings.get$;
    const subject = new rxjs_1.Subject();
    get.mockImplementation(() => 'bar');
    get$.mockImplementation(() => subject);
    return [core, subject];
};
let container;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    useObservableSpy.mockClear();
});
afterEach(() => {
    document.body.removeChild(container);
    container = null;
});
describe('useUiSetting', () => {
    const TestConsumer = ({ setting, newValue = '' }) => {
        const [value, set] = use_ui_setting_1.useUiSetting$(setting, 'DEFAULT');
        return (React.createElement("div", null,
            setting,
            ": ",
            React.createElement("strong", null, value),
            React.createElement("button", { onClick: () => set(newValue) }, "Set new value!")));
    };
    test('returns setting value', async () => {
        const [core] = mock();
        const { Provider } = context_1.createKibanaReactContext(core);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumer, { setting: "foo" })), container);
        const strong = container.querySelector('strong');
        expect(strong.textContent).toBe('bar');
        expect(core.uiSettings.get).toHaveBeenCalledTimes(1);
        expect(core.uiSettings.get.mock.calls[0][0]).toBe('foo');
    });
    test('calls uiSettings.get() method with correct key and default value', async () => {
        const [core] = mock();
        const { Provider } = context_1.createKibanaReactContext(core);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumer, { setting: "foo" })), container);
        expect(core.uiSettings.get).toHaveBeenCalledTimes(1);
        expect(core.uiSettings.get.mock.calls[0][0]).toBe('foo');
        expect(core.uiSettings.get.mock.calls[0][1]).toBe('DEFAULT');
    });
});
describe('useUiSetting$', () => {
    const TestConsumerX = ({ setting, newValue = '' }) => {
        const [value, set] = use_ui_setting_1.useUiSetting$(setting, 'DEFAULT');
        return (React.createElement("div", null,
            setting,
            ": ",
            React.createElement("strong", null, value),
            React.createElement("button", { onClick: () => set(newValue) }, "Set new value!")));
    };
    test('synchronously renders setting value', async () => {
        const [core] = mock();
        const { Provider } = context_1.createKibanaReactContext(core);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumerX, { setting: "foo" })), container);
        const strong = container.querySelector('strong');
        expect(strong.textContent).toBe('bar');
        expect(core.uiSettings.get).toHaveBeenCalledTimes(1);
        expect(core.uiSettings.get.mock.calls[0][0]).toBe('foo');
    });
    test('calls Core with correct arguments', async () => {
        const core = mocks_1.coreMock.createStart();
        const { Provider } = context_1.createKibanaReactContext(core);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumerX, { setting: "non_existing" })), container);
        expect(core.uiSettings.get).toHaveBeenCalledWith('non_existing', 'DEFAULT');
    });
    test('subscribes to observable using useObservable', async () => {
        const [core, subject] = mock();
        const { Provider } = context_1.createKibanaReactContext(core);
        expect(useObservableSpy).toHaveBeenCalledTimes(0);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumerX, { setting: "theme:darkMode" })), container);
        expect(useObservableSpy).toHaveBeenCalledTimes(1);
        expect(useObservableSpy.mock.calls[0][0]).toBe(subject);
    });
    test('can set new hook value', async () => {
        const [core] = mock();
        const { Provider } = context_1.createKibanaReactContext(core);
        ReactDOM.render(React.createElement(Provider, null,
            React.createElement(TestConsumerX, { setting: "a", newValue: "c" })), container);
        expect(core.uiSettings.set).toHaveBeenCalledTimes(0);
        test_utils_1.act(() => {
            test_utils_1.Simulate.click(container.querySelector('button'), {});
        });
        expect(core.uiSettings.set).toHaveBeenCalledTimes(1);
        expect(core.uiSettings.set).toHaveBeenCalledWith('a', 'c');
    });
});
