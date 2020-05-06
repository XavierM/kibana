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
const utils_1 = require("./utils");
const history_1 = require("history");
const application_service_1 = require("../application_service");
const http_service_mock_1 = require("../../http/http_service.mock");
const context_service_mock_1 = require("../../context/context_service.mock");
const injected_metadata_service_mock_1 = require("../../injected_metadata/injected_metadata_service.mock");
const overlay_service_mock_1 = require("../../overlays/overlay_service.mock");
describe('ApplicationService', () => {
    let setupDeps;
    let startDeps;
    let service;
    let history;
    let update;
    const navigate = (path) => {
        history.push(path);
        return update();
    };
    beforeEach(() => {
        history = history_1.createMemoryHistory();
        const http = http_service_mock_1.httpServiceMock.createSetupContract({ basePath: '/test' });
        http.post.mockResolvedValue({ navLinks: {} });
        setupDeps = {
            http,
            context: context_service_mock_1.contextServiceMock.createSetupContract(),
            injectedMetadata: injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract(),
            history: history,
        };
        setupDeps.injectedMetadata.getLegacyMode.mockReturnValue(false);
        startDeps = { http, overlays: overlay_service_mock_1.overlayServiceMock.createStartContract() };
        service = new application_service_1.ApplicationService();
    });
    describe('leaving an application that registered an app leave handler', () => {
        it('navigates to the new app if action is default', async () => {
            startDeps.overlays.openConfirm.mockResolvedValue(true);
            const { register } = service.setup(setupDeps);
            register(Symbol(), {
                id: 'app1',
                title: 'App1',
                mount: ({ onAppLeave }) => {
                    onAppLeave(actions => actions.default());
                    return () => undefined;
                },
            });
            register(Symbol(), {
                id: 'app2',
                title: 'App2',
                mount: ({}) => {
                    return () => undefined;
                },
            });
            const { navigateToApp, getComponent } = await service.start(startDeps);
            update = utils_1.createRenderer(getComponent());
            await navigate('/app/app1');
            await navigateToApp('app2');
            expect(startDeps.overlays.openConfirm).not.toHaveBeenCalled();
            expect(history.entries.length).toEqual(3);
            expect(history.entries[2].pathname).toEqual('/app/app2');
        });
        it('navigates to the new app if action is confirm and user accepted', async () => {
            startDeps.overlays.openConfirm.mockResolvedValue(true);
            const { register } = service.setup(setupDeps);
            register(Symbol(), {
                id: 'app1',
                title: 'App1',
                mount: ({ onAppLeave }) => {
                    onAppLeave(actions => actions.confirm('confirmation-message', 'confirmation-title'));
                    return () => undefined;
                },
            });
            register(Symbol(), {
                id: 'app2',
                title: 'App2',
                mount: ({}) => {
                    return () => undefined;
                },
            });
            const { navigateToApp, getComponent } = await service.start(startDeps);
            update = utils_1.createRenderer(getComponent());
            await navigate('/app/app1');
            await navigateToApp('app2');
            expect(startDeps.overlays.openConfirm).toHaveBeenCalledTimes(1);
            expect(startDeps.overlays.openConfirm).toHaveBeenCalledWith('confirmation-message', expect.objectContaining({ title: 'confirmation-title' }));
            expect(history.entries.length).toEqual(3);
            expect(history.entries[2].pathname).toEqual('/app/app2');
        });
        it('blocks navigation to the new app if action is confirm and user declined', async () => {
            startDeps.overlays.openConfirm.mockResolvedValue(false);
            const { register } = service.setup(setupDeps);
            register(Symbol(), {
                id: 'app1',
                title: 'App1',
                mount: ({ onAppLeave }) => {
                    onAppLeave(actions => actions.confirm('confirmation-message', 'confirmation-title'));
                    return () => undefined;
                },
            });
            register(Symbol(), {
                id: 'app2',
                title: 'App2',
                mount: ({}) => {
                    return () => undefined;
                },
            });
            const { navigateToApp, getComponent } = await service.start(startDeps);
            update = utils_1.createRenderer(getComponent());
            await navigate('/app/app1');
            await navigateToApp('app2');
            expect(startDeps.overlays.openConfirm).toHaveBeenCalledTimes(1);
            expect(startDeps.overlays.openConfirm).toHaveBeenCalledWith('confirmation-message', expect.objectContaining({ title: 'confirmation-title' }));
            expect(history.entries.length).toEqual(2);
            expect(history.entries[1].pathname).toEqual('/app/app1');
        });
    });
});
