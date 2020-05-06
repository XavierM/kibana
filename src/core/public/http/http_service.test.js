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
// @ts-ignore
const client_1 = tslib_1.__importDefault(require("fetch-mock/es5/client"));
const http_service_test_mocks_1 = require("./http_service.test.mocks");
const fatal_errors_service_mock_1 = require("../fatal_errors/fatal_errors_service.mock");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const http_service_1 = require("./http_service");
const rxjs_1 = require("rxjs");
describe('interceptors', () => {
    afterEach(() => client_1.default.restore());
    it('shares interceptors across setup and start', async () => {
        client_1.default.get('*', {});
        const injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
        const fatalErrors = fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract();
        const httpService = new http_service_1.HttpService();
        const setup = httpService.setup({ fatalErrors, injectedMetadata });
        const setupInterceptor = jest.fn();
        setup.intercept({ request: setupInterceptor });
        const start = httpService.start();
        const startInterceptor = jest.fn();
        start.intercept({ request: startInterceptor });
        await setup.get('/blah');
        expect(setupInterceptor).toHaveBeenCalledTimes(1);
        expect(startInterceptor).toHaveBeenCalledTimes(1);
        await start.get('/other-blah');
        expect(setupInterceptor).toHaveBeenCalledTimes(2);
        expect(startInterceptor).toHaveBeenCalledTimes(2);
    });
});
describe('#setup()', () => {
    it('registers Fetch#getLoadingCount$() with LoadingCountSetup#addLoadingCountSource()', () => {
        const injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
        const fatalErrors = fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract();
        const httpService = new http_service_1.HttpService();
        httpService.setup({ fatalErrors, injectedMetadata });
        const loadingServiceSetup = http_service_test_mocks_1.loadingServiceMock.setup.mock.results[0].value;
        // We don't verify that this Observable comes from Fetch#getLoadingCount$() to avoid complex mocking
        expect(loadingServiceSetup.addLoadingCountSource).toHaveBeenCalledWith(expect.any(rxjs_1.Observable));
    });
});
describe('#stop()', () => {
    it('calls loadingCount.stop()', () => {
        const injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
        const fatalErrors = fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract();
        const httpService = new http_service_1.HttpService();
        httpService.setup({ fatalErrors, injectedMetadata });
        httpService.start();
        httpService.stop();
        expect(http_service_test_mocks_1.loadingServiceMock.stop).toHaveBeenCalled();
    });
});
