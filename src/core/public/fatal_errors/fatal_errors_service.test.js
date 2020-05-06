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
const Rx = tslib_1.__importStar(require("rxjs"));
expect.addSnapshotSerializer({
    test: val => val instanceof Rx.Observable,
    print: () => `Rx.Observable`,
});
const fatal_errors_service_test_mocks_1 = require("./fatal_errors_service.test.mocks");
const injected_metadata_service_mock_1 = require("../injected_metadata/injected_metadata_service.mock");
const fatal_errors_service_1 = require("./fatal_errors_service");
function setupService() {
    const rootDomElement = document.createElement('div');
    const injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
    const stopCoreSystem = jest.fn();
    const i18n = {
        Context: function I18nContext() {
            return '';
        },
    };
    const fatalErrorsService = new fatal_errors_service_1.FatalErrorsService(rootDomElement, stopCoreSystem);
    return {
        rootDomElement,
        injectedMetadata,
        stopCoreSystem,
        fatalErrors: fatalErrorsService.setup({ injectedMetadata, i18n }),
    };
}
afterEach(() => {
    jest.resetAllMocks();
});
describe('#add()', () => {
    it('calls stopCoreSystem() param', () => {
        const { stopCoreSystem, fatalErrors } = setupService();
        expect(stopCoreSystem).not.toHaveBeenCalled();
        expect(() => {
            fatalErrors.add(new Error('foo'));
        }).toThrowError();
        expect(stopCoreSystem).toHaveBeenCalled();
        expect(stopCoreSystem).toHaveBeenCalledWith();
    });
    it('deletes all children of rootDomElement and renders <FatalErrorScreen /> into it', () => {
        const { fatalErrors, rootDomElement } = setupService();
        rootDomElement.innerHTML = `
      <h1>Loading...</h1>
      <div class="someSpinner"></div>
    `;
        expect(fatal_errors_service_test_mocks_1.mockRender).not.toHaveBeenCalled();
        expect(rootDomElement.children).toHaveLength(2);
        expect(() => {
            fatalErrors.add(new Error('foo'));
        }).toThrowError();
        expect(rootDomElement).toMatchSnapshot('fatal error screen container');
        expect(fatal_errors_service_test_mocks_1.mockRender.mock.calls).toMatchSnapshot('fatal error screen component');
    });
});
describe('setup.get$()', () => {
    it('provides info about the errors passed to fatalErrors.add()', () => {
        const { fatalErrors } = setupService();
        const onError = jest.fn();
        fatalErrors.get$().subscribe(onError);
        expect(onError).not.toHaveBeenCalled();
        expect(() => {
            fatalErrors.add(new Error('bar'));
        }).toThrowError();
        expect(onError).toHaveBeenCalled();
        expect(onError).toHaveBeenCalledWith({
            message: 'bar',
            stack: expect.stringMatching(/Error: bar[\w\W]+fatal_errors_service\.test\.ts/),
        });
    });
});
