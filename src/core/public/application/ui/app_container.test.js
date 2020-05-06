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
const enzyme_1 = require("enzyme");
const app_container_1 = require("./app_container");
const types_1 = require("../types");
const history_1 = require("history");
const scoped_history_1 = require("../scoped_history");
describe('AppContainer', () => {
    const appId = 'someApp';
    const setAppLeaveHandler = jest.fn();
    const flushPromises = async () => {
        await new Promise(async (resolve) => {
            setImmediate(() => resolve());
        });
    };
    const createResolver = () => {
        let resolve;
        const promise = new Promise(r => {
            resolve = r;
        });
        return [promise, resolve];
    };
    const createMounter = (promise) => ({
        appBasePath: '/base-path',
        appRoute: '/some-route',
        unmountBeforeMounting: false,
        mount: async ({ element }) => {
            await promise;
            const container = document.createElement('div');
            container.innerHTML = 'some-content';
            element.appendChild(container);
            return () => container.remove();
        },
    });
    it('should hide the "not found" page before mounting the route', async () => {
        const [waitPromise, resolvePromise] = createResolver();
        const mounter = createMounter(waitPromise);
        const wrapper = enzyme_1.mount(react_1.default.createElement(app_container_1.AppContainer, { appPath: `/app/${appId}`, appId: appId, appStatus: types_1.AppStatus.inaccessible, mounter: mounter, setAppLeaveHandler: setAppLeaveHandler, createScopedHistory: (appPath) => 
            // Create a history using the appPath as the current location
            new scoped_history_1.ScopedHistory(history_1.createMemoryHistory({ initialEntries: [appPath] }), appPath) }));
        expect(wrapper.text()).toContain('Application Not Found');
        wrapper.setProps({
            appId,
            setAppLeaveHandler,
            mounter,
            appStatus: types_1.AppStatus.accessible,
        });
        wrapper.update();
        expect(wrapper.text()).toEqual('');
        resolvePromise();
        await flushPromises();
        wrapper.update();
        expect(wrapper.text()).toContain('some-content');
    });
});
