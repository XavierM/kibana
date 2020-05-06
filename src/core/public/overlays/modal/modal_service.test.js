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
const overlay_test_mocks_1 = require("../overlay.test.mocks");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const i18n_service_mock_1 = require("../../i18n/i18n_service.mock");
const modal_service_1 = require("./modal_service");
const utils_1 = require("../../utils");
const i18nMock = i18n_service_mock_1.i18nServiceMock.createStartContract();
beforeEach(() => {
    overlay_test_mocks_1.mockReactDomRender.mockClear();
    overlay_test_mocks_1.mockReactDomUnmount.mockClear();
});
const getServiceStart = () => {
    const service = new modal_service_1.ModalService();
    return service.start({ i18n: i18nMock, targetDomElement: document.createElement('div') });
};
describe('ModalService', () => {
    let modals;
    beforeEach(() => {
        modals = getServiceStart();
    });
    describe('openModal()', () => {
        it('renders a modal to the DOM', () => {
            expect(overlay_test_mocks_1.mockReactDomRender).not.toHaveBeenCalled();
            modals.open(container => {
                const content = document.createElement('span');
                content.textContent = 'Modal content';
                container.append(content);
                return () => { };
            });
            expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
            const modalContent = enzyme_1.mount(overlay_test_mocks_1.mockReactDomRender.mock.calls[0][0]);
            expect(modalContent.html()).toMatchSnapshot();
        });
        describe('with a currently active modal', () => {
            let ref1;
            beforeEach(() => {
                ref1 = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Modal content 1")));
            });
            it('replaces the current modal with a new one', () => {
                modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Flyout content 2")));
                expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
                expect(() => ref1.close()).not.toThrowError();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
            });
            it('resolves onClose on the previous ref', async () => {
                const onCloseComplete = jest.fn();
                ref1.onClose.then(onCloseComplete);
                modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Flyout content 2")));
                await ref1.onClose;
                expect(onCloseComplete).toBeCalledTimes(1);
            });
        });
        describe('with a currently active confirm', () => {
            let confirm1;
            beforeEach(() => {
                confirm1 = modals.openConfirm('confirm 1');
            });
            it('replaces the current confirm with the new one', () => {
                modals.openConfirm('some confirm');
                expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
            });
            it('resolves the previous confirm promise', async () => {
                modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Flyout content 2")));
                expect(await confirm1).toEqual(false);
            });
        });
    });
    describe('openConfirm()', () => {
        it('renders a mountpoint confirm message', () => {
            expect(overlay_test_mocks_1.mockReactDomRender).not.toHaveBeenCalled();
            modals.openConfirm(container => {
                const content = document.createElement('span');
                content.textContent = 'Modal content';
                container.append(content);
                return () => { };
            });
            expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
            const modalContent = enzyme_1.mount(overlay_test_mocks_1.mockReactDomRender.mock.calls[0][0]);
            expect(modalContent.html()).toMatchSnapshot();
        });
        it('renders a string confirm message', () => {
            expect(overlay_test_mocks_1.mockReactDomRender).not.toHaveBeenCalled();
            modals.openConfirm('Some message');
            expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
            const modalContent = enzyme_1.mount(overlay_test_mocks_1.mockReactDomRender.mock.calls[0][0]);
            expect(modalContent.html()).toMatchSnapshot();
        });
        describe('with a currently active modal', () => {
            let ref1;
            beforeEach(() => {
                ref1 = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Modal content 1")));
            });
            it('replaces the current modal with the new confirm', () => {
                modals.openConfirm('some confirm');
                expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
                expect(() => ref1.close()).not.toThrowError();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
            });
            it('resolves onClose on the previous ref', async () => {
                const onCloseComplete = jest.fn();
                ref1.onClose.then(onCloseComplete);
                modals.openConfirm('some confirm');
                await ref1.onClose;
                expect(onCloseComplete).toBeCalledTimes(1);
            });
        });
        describe('with a currently active confirm', () => {
            let confirm1;
            beforeEach(() => {
                confirm1 = modals.openConfirm('confirm 1');
            });
            it('replaces the current confirm with the new one', () => {
                modals.openConfirm('some confirm');
                expect(overlay_test_mocks_1.mockReactDomRender.mock.calls).toMatchSnapshot();
                expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
            });
            it('resolves the previous confirm promise', async () => {
                modals.openConfirm('some confirm');
                expect(await confirm1).toEqual(false);
            });
        });
    });
    describe('ModalRef#close()', () => {
        it('resolves the onClose Promise', async () => {
            const ref = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Flyout content")));
            const onCloseComplete = jest.fn();
            ref.onClose.then(onCloseComplete);
            await ref.close();
            await ref.close();
            expect(onCloseComplete).toHaveBeenCalledTimes(1);
        });
        it('can be called multiple times on the same ModalRef', async () => {
            const ref = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Flyout content")));
            expect(overlay_test_mocks_1.mockReactDomUnmount).not.toHaveBeenCalled();
            await ref.close();
            expect(overlay_test_mocks_1.mockReactDomUnmount.mock.calls).toMatchSnapshot();
            await ref.close();
            expect(overlay_test_mocks_1.mockReactDomUnmount).toHaveBeenCalledTimes(1);
        });
        it("on a stale ModalRef doesn't affect the active flyout", async () => {
            const ref1 = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Modal content 1")));
            const ref2 = modals.open(utils_1.mountReactNode(react_1.default.createElement("span", null, "Modal content 2")));
            const onCloseComplete = jest.fn();
            ref2.onClose.then(onCloseComplete);
            overlay_test_mocks_1.mockReactDomUnmount.mockClear();
            await ref1.close();
            expect(overlay_test_mocks_1.mockReactDomUnmount).toBeCalledTimes(0);
            expect(onCloseComplete).toBeCalledTimes(0);
        });
    });
});
