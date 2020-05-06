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
jest.mock('./send_request_to_es', () => ({ sendRequestToES: jest.fn() }));
jest.mock('../../contexts/editor_context/editor_registry', () => ({
    instance: { getInputEditor: jest.fn() },
}));
jest.mock('./track', () => ({ track: jest.fn() }));
jest.mock('../../contexts/request_context', () => ({ useRequestActionContext: jest.fn() }));
const react_1 = tslib_1.__importDefault(require("react"));
const react_hooks_1 = require("@testing-library/react-hooks");
const contexts_1 = require("../../contexts");
const services_context_mock_1 = require("../../contexts/services_context.mock");
const request_context_1 = require("../../contexts/request_context");
const editor_registry_1 = require("../../contexts/editor_context/editor_registry");
const send_request_to_es_1 = require("./send_request_to_es");
const use_send_current_request_to_es_1 = require("./use_send_current_request_to_es");
describe('useSendCurrentRequestToES', () => {
    let mockContextValue;
    let dispatch;
    const contexts = ({ children }) => (react_1.default.createElement(contexts_1.ServicesContextProvider, { value: mockContextValue }, children));
    beforeEach(() => {
        mockContextValue = services_context_mock_1.serviceContextMock.create();
        dispatch = jest.fn();
        request_context_1.useRequestActionContext.mockReturnValue(dispatch);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('calls send request to ES', async () => {
        // Set up mocks
        mockContextValue.services.settings.toJSON.mockReturnValue({});
        // This request should succeed
        send_request_to_es_1.sendRequestToES.mockResolvedValue([]);
        editor_registry_1.instance.getInputEditor.mockImplementation(() => ({
            getRequestsInRange: () => ['test'],
        }));
        const { result } = react_hooks_1.renderHook(() => use_send_current_request_to_es_1.useSendCurrentRequestToES(), { wrapper: contexts });
        await react_hooks_1.act(() => result.current());
        expect(send_request_to_es_1.sendRequestToES).toHaveBeenCalledWith({ requests: ['test'] });
        // Second call should be the request success
        const [, [requestSucceededCall]] = dispatch.mock.calls;
        expect(requestSucceededCall).toEqual({ type: 'requestSuccess', payload: { data: [] } });
    });
    it('handles known errors', async () => {
        // Set up mocks
        send_request_to_es_1.sendRequestToES.mockRejectedValue({ response: 'nada' });
        editor_registry_1.instance.getInputEditor.mockImplementation(() => ({
            getRequestsInRange: () => ['test'],
        }));
        const { result } = react_hooks_1.renderHook(() => use_send_current_request_to_es_1.useSendCurrentRequestToES(), { wrapper: contexts });
        await react_hooks_1.act(() => result.current());
        // Second call should be the request failure
        const [, [requestFailedCall]] = dispatch.mock.calls;
        // The request must have concluded
        expect(requestFailedCall).toEqual({ type: 'requestFail', payload: { response: 'nada' } });
    });
    it('handles unknown errors', async () => {
        // Set up mocks
        send_request_to_es_1.sendRequestToES.mockRejectedValue(NaN /* unexpected error value */);
        editor_registry_1.instance.getInputEditor.mockImplementation(() => ({
            getRequestsInRange: () => ['test'],
        }));
        const { result } = react_hooks_1.renderHook(() => use_send_current_request_to_es_1.useSendCurrentRequestToES(), { wrapper: contexts });
        await react_hooks_1.act(() => result.current());
        // Second call should be the request failure
        const [, [requestFailedCall]] = dispatch.mock.calls;
        // The request must have concluded
        expect(requestFailedCall).toEqual({ type: 'requestFail', payload: undefined });
        // It also notified the user
        expect(mockContextValue.services.notifications.toasts.addError).toHaveBeenCalledWith(NaN, {
            title: 'Unknown Request Error',
        });
    });
});
