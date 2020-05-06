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
/* eslint-disable @kbn/eslint/no-restricted-paths */
const http_1 = require("../../core/public/http");
const fatal_errors_service_mock_1 = require("../../core/public/fatal_errors/fatal_errors_service.mock");
const injected_metadata_service_mock_1 = require("../../core/public/injected_metadata/injected_metadata_service.mock");
const defaultTap = (injectedMetadata) => {
    injectedMetadata.getBasePath.mockReturnValue('http://localhost/myBase');
};
function setup(tap = defaultTap) {
    const injectedMetadata = injected_metadata_service_mock_1.injectedMetadataServiceMock.createSetupContract();
    const fatalErrors = fatal_errors_service_mock_1.fatalErrorsServiceMock.createSetupContract();
    tap(injectedMetadata, fatalErrors);
    const httpService = new http_1.HttpService();
    const http = httpService.setup({ fatalErrors, injectedMetadata });
    return { httpService, injectedMetadata, fatalErrors, http };
}
exports.setup = setup;
